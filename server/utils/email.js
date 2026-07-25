const nodemailer = require('nodemailer');

let transporter = null;

// Without explicit timeouts, a blocked/unreachable SMTP connection (common on
// some cloud hosts' outbound networking) hangs indefinitely instead of
// failing — the request never resolves, so the client just spins forever.
const CONNECTION_TIMEOUT_MS = 10000;
const GREETING_TIMEOUT_MS = 10000;
const SOCKET_TIMEOUT_MS = 15000;

function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return null;

  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 465,
    secure: String(process.env.EMAIL_SECURE || 'true') === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: CONNECTION_TIMEOUT_MS,
    greetingTimeout: GREETING_TIMEOUT_MS,
    socketTimeout: SOCKET_TIMEOUT_MS,
  });
  return transporter;
}

function isConfigured() {
  return Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);
}

async function sendMail({ to, bcc, subject, html }) {
  const t = getTransporter();
  if (!t) {
    console.warn('Email not configured (EMAIL_USER/EMAIL_PASS missing) — skipping send:', subject);
    return { sent: false, reason: 'not_configured' };
  }
  const from = process.env.EMAIL_FROM || `SP Mobile <${process.env.EMAIL_USER}>`;
  try {
    await t.sendMail({ from, to, bcc, subject, html });
    return { sent: true };
  } catch (err) {
    console.error('Failed to send email:', err.message);
    return { sent: false, reason: err.message };
  }
}

module.exports = { sendMail, isConfigured };
