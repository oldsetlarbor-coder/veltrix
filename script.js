
const BOT_TOKEN = '9173914860:AAGOkwv2SWY6B116tGEmYQj1n0Z-DHoKd2s';
const CHAT_ID = '8014181553';

const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
const toast = document.getElementById('toast');
document.getElementById('year').textContent = new Date().getFullYear();

menuToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.textContent = isOpen ? '×' : '☰';
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.textContent = '☰';
}));

document.querySelectorAll('[data-course]').forEach(link => {
  link.addEventListener('click', () => {
    const courseSelect = document.getElementById('courseSelect');
    const course = link.dataset.course;
    [...courseSelect.options].forEach(option => {
      if (option.textContent === course) courseSelect.value = option.value;
    });
  });
});

let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 4200);
}
function setStatus(element, message, isError = false) {
  element.textContent = message;
  element.classList.toggle('error', isError);
}
function escapeMessage(value) {
  return String(value || '').trim();
}
async function sendToTelegram(textMessage, statusElement) {
  if (!BOT_TOKEN || BOT_TOKEN.includes('SHU_YERGA') || !CHAT_ID || CHAT_ID.includes('SHU_YERGA')) {
    setStatus(statusElement, 'Ariza formasi ishlashga tayyor, ammo script.js ichida BOT_TOKEN va CHAT_ID ni kiriting.', true);
    showToast('Avval script.js ichidagi bot sozlamalarini to‘ldiring.');
    return false;
  }
  const endpoint = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text: textMessage, parse_mode: 'HTML' })
    });
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error(result.description || 'Telegram xabari yuborilmadi.');
    setStatus(statusElement, 'Muvaffaqiyatli yuborildi! Tez orada siz bilan bog‘lanamiz.');
    showToast('Xabaringiz Telegram orqali yuborildi.');
    return true;
  } catch (error) {
    console.error('Telegram send error:', error);
    setStatus(statusElement, 'Xabar yuborilmadi. Bot tokeni, Chat ID va internet aloqasini tekshiring.', true);
    showToast('Yuborishda xatolik. Sozlamalarni tekshiring.');
    return false;
  }
}
function safeHtml(value) {
  return escapeMessage(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

document.getElementById('enrollForm').addEventListener('submit', async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.getElementById('enrollStatus');
  const data = new FormData(form);
  const message = [
    '🎓 <b>VELTRIX ACADEMY — KURS ARIZASI</b>',
    `👤 Ism: ${safeHtml(data.get('name'))}`,
    `📞 Telefon: ${safeHtml(data.get('phone'))}`,
    `📚 Kurs: ${safeHtml(data.get('course'))}`,
    `💬 Izoh: ${safeHtml(data.get('message') || 'Kiritilmagan')}`
  ].join('\n');
  const button = form.querySelector('button[type="submit"]');
  button.disabled = true; button.textContent = 'Yuborilmoqda…';
  const sent = await sendToTelegram(message, status);
  if (sent) form.reset();
  button.disabled = false; button.innerHTML = 'Arizani yuborish <span>↗</span>';
});

document.getElementById('contactForm').addEventListener('submit', async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.getElementById('contactStatus');
  const data = new FormData(form);
  const message = [
    '✉️ <b>VELTRIX ACADEMY — ALOQA XABARI</b>',
    `👤 Ism: ${safeHtml(data.get('name'))}`,
    `📞 Telefon: ${safeHtml(data.get('phone'))}`,
    `💬 Xabar: ${safeHtml(data.get('message'))}`
  ].join('\n');
  const button = form.querySelector('button[type="submit"]');
  button.disabled = true; button.textContent = 'Yuborilmoqda…';
  const sent = await sendToTelegram(message, status);
  if (sent) form.reset();
  button.disabled = false; button.innerHTML = 'Xabarni yuborish <span>↗</span>';
});
