const User = require('../models/User');
const { sendMail } = require('../utils/email');

const BATCH_SIZE = 40; // stay well under typical SMTP recipient-per-message limits

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function audience(req, res) {
  const count = await User.countDocuments({ role: 'customer' });
  res.json({ count });
}

async function send(req, res) {
  const { subject, message } = req.body;
  if (!subject || !message) {
    return res.status(400).json({ message: 'Subject and message are required' });
  }

  const customers = await User.find({ role: 'customer' }).select('email');
  const emails = customers.map((c) => c.email).filter(Boolean);
  if (emails.length === 0) {
    return res.status(400).json({ message: 'No customers to send to yet' });
  }

  const html = `
    <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
      <h2 style="color:#16235d;">SP Mobile</h2>
      <div style="white-space: pre-line; color:#1f2937;">${message}</div>
      <hr style="margin-top:24px;" />
      <p style="font-size:12px; color:#6b7280;">
        SP Mobile, Appapada, Malad East, Auto Stand Near 624 Bus Stop &middot; 9653206528 &middot; aa6871678@gmail.com
      </p>
    </div>
  `;

  const batches = chunk(emails, BATCH_SIZE);
  let sent = 0;
  for (const batch of batches) {
    const result = await sendMail({ to: process.env.EMAIL_FROM || process.env.EMAIL_USER, bcc: batch, subject, html });
    if (result.sent) sent += batch.length;
  }

  res.json({ totalCustomers: emails.length, sent, configured: sent > 0 || emails.length === 0 });
}

module.exports = { audience, send };
