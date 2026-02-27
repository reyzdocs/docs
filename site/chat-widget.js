const STORAGE_KEY = 'reyz_web_chat_v1';
const POLL_INTERVAL_MS = 5000; // Fallback polling (Socket.IO is primary)
const MAX_RENDERED_MESSAGES = 200;
const TYPING_TIMEOUT_MS = 3000;

const API_BASE = (() => {
  if (window.REYZ_CHAT_API_BASE) return String(window.REYZ_CHAT_API_BASE).replace(/\/$/, '');
  const isLocal = /localhost|127\.0\.0\.1/.test(window.location.hostname);
  if (isLocal) return 'http://localhost:3000/api/v1/web-chat';
  return 'https://api.reyz.app/api/v1/web-chat';
})();

const WS_URL = (() => {
  if (window.REYZ_CHAT_WS_URL) return String(window.REYZ_CHAT_WS_URL).replace(/\/$/, '');
  const isLocal = /localhost|127\.0\.0\.1/.test(window.location.hostname);
  if (isLocal) return 'http://localhost:3000';
  return 'https://api.reyz.app';
})();

const widget = document.getElementById('web-chat-widget');
const launchBtn = document.getElementById('web-chat-launch');
const panel = document.getElementById('web-chat-panel');
const closeBtn = document.getElementById('web-chat-close');
const form = document.getElementById('web-chat-form');
const input = document.getElementById('web-chat-input');
const messagesEl = document.getElementById('web-chat-messages');
const badge = document.getElementById('web-chat-badge');
const typingEl = document.getElementById('web-chat-typing');
const chipsEl = document.getElementById('web-chat-chips');

if (!widget || !launchBtn || !panel || !closeBtn || !form || !input || !messagesEl) {
  throw new Error('Web chat widget DOM is missing');
}

let pollTimer = null;
let sessionId = null;
let clientToken = null;
let lastMessageAt = null;
let openOnce = false;
let socket = null;
let socketConnected = false;
let typingTimer = null;
let unreadCount = 0;
let lockScrollY = 0;

// ── State persistence ──

function saveState() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ sessionId, clientToken, lastMessageAt }),
    );
  } catch (_) { /* ignore */ }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    sessionId = parsed.sessionId || null;
    clientToken = parsed.clientToken || null;
    lastMessageAt = parsed.lastMessageAt || null;
  } catch (_) { /* ignore */ }
}

// ── Helpers ──

function formatTime(iso) {
  const date = new Date(iso);
  if (!Number.isFinite(date.getTime())) return '';
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

function isWidgetOpen() {
  return widget.classList.contains('open');
}

// ── Badge ──

function updateBadge() {
  if (!badge) return;
  if (unreadCount > 0 && !isWidgetOpen()) {
    badge.textContent = unreadCount > 9 ? '9+' : String(unreadCount);
    badge.style.display = '';
  } else {
    badge.style.display = 'none';
    unreadCount = 0;
  }
}

// ── Typing indicator ──

function showTyping() {
  if (!typingEl) return;
  typingEl.style.display = '';
  messagesEl.scrollTop = messagesEl.scrollHeight;

  clearTimeout(typingTimer);
  typingTimer = setTimeout(hideTyping, TYPING_TIMEOUT_MS);
}

function hideTyping() {
  if (!typingEl) return;
  typingEl.style.display = 'none';
  clearTimeout(typingTimer);
}

// ── Message rendering ──

function appendStatus(text) {
  const row = document.createElement('div');
  row.className = 'web-chat-status';
  row.textContent = text;
  messagesEl.append(row);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function makeMessageNode(message) {
  const isUserMessage = message.direction === 'incoming';

  const item = document.createElement('article');
  item.className = `web-chat-message ${isUserMessage ? 'outgoing' : 'incoming'}`;
  item.dataset.messageId = message.id;

  const text = document.createElement('div');
  text.textContent = message.text;
  item.append(text);

  const meta = document.createElement('div');
  meta.className = 'web-chat-meta';
  meta.textContent = `${message.senderLabel || (isUserMessage ? 'Вы' : 'Поддержка')} · ${formatTime(message.createdAt)}`;
  item.append(meta);

  return item;
}

function hasMessage(id) {
  return Boolean(messagesEl.querySelector(`[data-message-id="${CSS.escape(id)}"]`));
}

function trimMessages() {
  const nodes = messagesEl.querySelectorAll('.web-chat-message');
  const overflow = nodes.length - MAX_RENDERED_MESSAGES;
  if (overflow <= 0) return;
  for (let i = 0; i < overflow; i += 1) {
    nodes[i].remove();
  }
}

function appendMessages(messages, fromRealtime = false) {
  if (!Array.isArray(messages) || !messages.length) return;

  let added = false;
  for (const message of messages) {
    if (!message || !message.id || hasMessage(message.id)) continue;
    hideTyping();
    messagesEl.append(makeMessageNode(message));
    lastMessageAt = message.createdAt || lastMessageAt;
    added = true;

    // Count unread if widget is closed and message is from operator
    if (!isWidgetOpen() && message.direction === 'outgoing') {
      unreadCount += 1;
    }
  }

  if (added) {
    trimMessages();
    messagesEl.scrollTop = messagesEl.scrollHeight;
    saveState();
    updateBadge();
  }
}

// ── HTTP requests ──

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json' };

  // Always send clientToken via header instead of query string
  if (clientToken) {
    headers['X-WebChat-Token'] = clientToken;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    headers,
    ...options,
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch (_) { /* ignore */ }

  if (!response.ok) {
    const message = payload && payload.error ? payload.error : `HTTP ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return payload;
}

async function ensureSession() {
  if (sessionId && clientToken) return;

  const payload = await request('/start', {
    method: 'POST',
    body: JSON.stringify({}),
  });

  sessionId = payload.sessionId;
  clientToken = payload.clientToken;
  lastMessageAt = null;
  saveState();
}

async function loadMessages() {
  if (!sessionId || !clientToken) return;

  const query = new URLSearchParams({ sessionId, clientToken });
  if (lastMessageAt) {
    query.set('after', lastMessageAt);
  }

  const payload = await request(`/messages?${query.toString()}`);
  appendMessages(payload.messages || []);

  const status = String(payload.session?.status || 'open').toLowerCase();
  if (status !== 'open') {
    disableInput();
    appendStatus('Чат закрыт. Напишите в support@reyz.app');
  }
}

function disableInput() {
  input.disabled = true;
  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) submitBtn.disabled = true;
}

async function sendMessage(text) {
  const payload = await request('/message', {
    method: 'POST',
    body: JSON.stringify({ sessionId, clientToken, text }),
  });

  if (payload && payload.message) {
    appendMessages([payload.message]);
  }
}

// ── Socket.IO realtime ──

function connectSocket() {
  if (socket || !sessionId || !clientToken) return;

  // Dynamically load socket.io client if not present
  if (typeof io === 'undefined') {
    const script = document.createElement('script');
    script.src = `${WS_URL}/socket.io/socket.io.js`;
    script.onload = () => _initSocket();
    script.onerror = () => {
      console.warn('[WebChat] Failed to load socket.io client, using polling only');
    };
    document.head.append(script);
    return;
  }

  _initSocket();
}

function _initSocket() {
  if (socket || typeof io === 'undefined') return;

  try {
    socket = io(WS_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 2000,
      reconnectionAttempts: 10,
      query: { type: 'webchat' },
    });

    socket.on('connect', () => {
      socketConnected = true;
      console.log('[WebChat] Socket.IO connected');
      socket.emit('webchat:join', { sessionId, clientToken });
    });

    socket.on('disconnect', () => {
      socketConnected = false;
      console.log('[WebChat] Socket.IO disconnected');
    });

    socket.on('webchat:message', (data) => {
      if (data && data.id) {
        appendMessages([data], true);
      }
    });

    socket.on('webchat:typing', () => {
      showTyping();
    });

    socket.on('webchat:closed', () => {
      disableInput();
      appendStatus('Чат закрыт оператором.');
    });
  } catch (error) {
    console.warn('[WebChat] Socket.IO init failed:', error.message);
  }
}

function disconnectSocket() {
  if (!socket) return;
  try {
    if (sessionId) {
      socket.emit('webchat:leave', { sessionId });
    }
    socket.disconnect();
  } catch (_) { /* ignore */ }
  socket = null;
  socketConnected = false;
}

// ── Polling (fallback) ──

function startPolling() {
  if (pollTimer) return;
  pollTimer = window.setInterval(() => {
    // Skip polling if socket is connected (realtime is active)
    if (socketConnected) return;
    loadMessages().catch((error) => {
      console.warn('[WebChat] Poll failed:', error.message);
    });
  }, POLL_INTERVAL_MS);
}

function stopPolling() {
  if (!pollTimer) return;
  clearInterval(pollTimer);
  pollTimer = null;
}

// ── Widget open/close ──

function isMobileViewport() {
  return window.matchMedia('(max-width: 640px)').matches;
}

function lockBackgroundScroll() {
  lockScrollY = window.scrollY || window.pageYOffset || 0;
  document.documentElement.classList.add('web-chat-no-scroll');
  document.body.classList.add('web-chat-no-scroll');
  document.body.style.top = `-${lockScrollY}px`;
}

function unlockBackgroundScroll() {
  document.documentElement.classList.remove('web-chat-no-scroll');
  document.body.classList.remove('web-chat-no-scroll');
  document.body.style.removeProperty('top');
  window.scrollTo(0, lockScrollY);
}

function setOpen(isOpen) {
  widget.classList.toggle('open', isOpen);
  launchBtn.setAttribute('aria-expanded', String(isOpen));

  if (isOpen) {
    if (isMobileViewport()) {
      lockBackgroundScroll();
    }
    unreadCount = 0;
    updateBadge();
    startPolling();
    connectSocket();
  } else {
    unlockBackgroundScroll();
    stopPolling();
    // Keep socket alive for background notifications
  }
}

// ── Event listeners ──

launchBtn.addEventListener('click', async () => {
  const willOpen = !isWidgetOpen();
  setOpen(willOpen);

  if (!willOpen) return;

  if (!openOnce) {
    openOnce = true;
    appendStatus('Подключаем чат...');
  }

  try {
    await ensureSession();
    await loadMessages();
    connectSocket();
  } catch (error) {
    appendStatus('Не удалось подключить чат. Попробуйте позже.');
    console.error('[WebChat] Open failed:', error);
  }
});

closeBtn.addEventListener('click', () => setOpen(false));


form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const text = String(input.value || '').trim();

  // Proper validation: reject empty or whitespace-only text
  if (!text || text.length === 0) {
    input.value = '';
    return;
  }

  input.disabled = true;
  const submit = form.querySelector('button[type="submit"]');
  submit.disabled = true;

  try {
    await ensureSession();
    await sendMessage(text);
    input.value = '';
    hideChips();
  } catch (error) {
    appendStatus('Сообщение не отправлено. Попробуйте еще раз.');
    console.error('[WebChat] Send failed:', error);
  } finally {
    input.disabled = false;
    submit.disabled = false;
    input.focus();
  }
});

// ── Quick-reply chips ──

function hideChips() {
  if (chipsEl) chipsEl.hidden = true;
}

if (chipsEl) {
  chipsEl.addEventListener('click', async (e) => {
    const chip = e.target.closest('.web-chat-chip');
    if (!chip) return;

    const text = chip.dataset.text;
    if (!text) return;

    hideChips();

    try {
      await ensureSession();
      await sendMessage(text);
    } catch (error) {
      appendStatus('Сообщение не отправлено. Попробуйте еще раз.');
      console.error('[WebChat] Chip send failed:', error);
    }
  });
}

// Handle Enter key in textarea (send on Enter, newline on Shift+Enter)
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    form.dispatchEvent(new Event('submit', { cancelable: true }));
  }
});

window.addEventListener('beforeunload', () => {
  unlockBackgroundScroll();
  stopPolling();
  disconnectSocket();
});

// ── Init ──

loadState();

// If we have a saved session, connect socket immediately for background notifications
if (sessionId && clientToken) {
  connectSocket();
}
