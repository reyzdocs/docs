const STORAGE_KEY = 'reyz_web_chat_v1';
const POLL_INTERVAL_MS = 3000;
const MAX_RENDERED_MESSAGES = 200;

const API_BASE = (() => {
  if (window.REYZ_CHAT_API_BASE) return String(window.REYZ_CHAT_API_BASE).replace(/\/$/, '');
  const isLocal = /localhost|127\.0\.0\.1/.test(window.location.hostname);
  if (isLocal) return 'http://localhost:3000/api/v1/web-chat';
  return 'https://api.reyz.app/api/v1/web-chat';
})();

const widget = document.getElementById('web-chat-widget');
const launchBtn = document.getElementById('web-chat-launch');
const panel = document.getElementById('web-chat-panel');
const closeBtn = document.getElementById('web-chat-close');
const form = document.getElementById('web-chat-form');
const input = document.getElementById('web-chat-input');
const messagesEl = document.getElementById('web-chat-messages');

if (!widget || !launchBtn || !panel || !closeBtn || !form || !input || !messagesEl) {
  throw new Error('Web chat widget DOM is missing');
}

let pollTimer = null;
let sessionId = null;
let clientToken = null;
let lastMessageAt = null;
let openOnce = false;

function saveState() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        sessionId,
        clientToken,
        lastMessageAt,
      }),
    );
  } catch (_) {
    // ignore
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    sessionId = parsed.sessionId || null;
    clientToken = parsed.clientToken || null;
    lastMessageAt = parsed.lastMessageAt || null;
  } catch (_) {
    // ignore
  }
}

function formatTime(iso) {
  const date = new Date(iso);
  if (!Number.isFinite(date.getTime())) return '';
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

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

function appendMessages(messages) {
  if (!Array.isArray(messages) || !messages.length) return;

  for (const message of messages) {
    if (!message || !message.id || hasMessage(message.id)) continue;
    messagesEl.append(makeMessageNode(message));
    lastMessageAt = message.createdAt || lastMessageAt;
  }

  trimMessages();
  messagesEl.scrollTop = messagesEl.scrollHeight;
  saveState();
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch (_) {
    // ignore
  }

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

  const query = new URLSearchParams({
    sessionId,
    clientToken,
  });
  if (lastMessageAt) {
    query.set('after', lastMessageAt);
  }

  const payload = await request(`/messages?${query.toString()}`);
  appendMessages(payload.messages || []);

  const status = String(payload.session?.status || 'open').toLowerCase();
  if (status !== 'open') {
    input.disabled = true;
    form.querySelector('button[type="submit"]').disabled = true;
    appendStatus('Чат закрыт. Напишите в support@reyz.app');
  }
}

async function sendMessage(text) {
  const payload = await request('/message', {
    method: 'POST',
    body: JSON.stringify({
      sessionId,
      clientToken,
      text,
    }),
  });

  if (payload && payload.message) {
    appendMessages([payload.message]);
  }
}

function startPolling() {
  if (pollTimer) return;
  pollTimer = window.setInterval(() => {
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

function setOpen(isOpen) {
  widget.classList.toggle('open', isOpen);
  launchBtn.setAttribute('aria-expanded', String(isOpen));
  if (isOpen) {
    input.focus();
    startPolling();
  } else {
    stopPolling();
  }
}

launchBtn.addEventListener('click', async () => {
  const willOpen = !widget.classList.contains('open');
  setOpen(willOpen);

  if (!willOpen) return;

  if (!openOnce) {
    openOnce = true;
    appendStatus('Подключаем чат...');
  }

  try {
    await ensureSession();
    await loadMessages();
  } catch (error) {
    appendStatus('Не удалось подключить чат. Попробуйте позже.');
    console.error('[WebChat] Open failed:', error);
  }
});

closeBtn.addEventListener('click', () => setOpen(false));

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const text = String(input.value || '').trim();
  if (!text) return;

  input.disabled = true;
  const submit = form.querySelector('button[type="submit"]');
  submit.disabled = true;

  try {
    await ensureSession();
    await sendMessage(text);
    input.value = '';
    await loadMessages();
  } catch (error) {
    appendStatus('Сообщение не отправлено. Попробуйте еще раз.');
    console.error('[WebChat] Send failed:', error);
  } finally {
    input.disabled = false;
    submit.disabled = false;
    input.focus();
  }
});

window.addEventListener('beforeunload', () => {
  stopPolling();
});

loadState();
