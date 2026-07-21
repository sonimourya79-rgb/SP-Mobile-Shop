const nodemailer = require('nodemailer');

let transporter = null;

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
  });
  return transporter;
}

async function sendMail({ to, bcc, subject, html }) {
  const t = getTransporter();
  if (!t) {
    console.warn('Email not configured (EMAIL_USER/EMAIL_PASS missing) — skipping send:', subject);
    return { sent: false };
  }
  const from = process.env.EMAIL_FROM || `SP Mobile <${process.env.EMAIL_USER}>`;
  await t.sendMail({ from, to, bcc, subject, html });
  return { sent: true };
}

module.exports = { sendMail };
