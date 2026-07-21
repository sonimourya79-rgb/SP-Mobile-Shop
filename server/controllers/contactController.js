const ContactMessage = require('../models/ContactMessage');
const { sendMail } = require('../utils/email');

async function create(req, res) {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email and message are required' });
  }

  const contact = await ContactMessage.create({ name, email, phone, subject, message });

  const shopEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
  if (shopEmail) {
    sendMail({
      to: shopEmail,
      subject: `New Contact Message: ${contact.subject}`,
      html: `
        <p><strong>Name:</strong> ${contact.name}</p>
        <p><strong>Email:</strong> ${contact.email}</p>
        <p><strong>Phone:</strong> ${contact.phone || '-'}</p>
        <p><strong>Message:</strong></p>
        <p>${contact.message.replace(/\n/g, '<br/>')}</p>
      `,
    }).catch((err) => console.error('Failed to send contact notification email:', err.message));
  }

  res.status(201).json(contact);
}

async function listAdmin(req, res) {
  const query = {};
  if (req.query.status) query.status = req.query.status;
  const messages = await ContactMessage.find(query).sort({ createdAt: -1 });
  res.json(messages);
}

async function updateStatus(req, res) {
  const message = await ContactMessage.findById(req.params.id);
  if (!message) return res.status(404).json({ message: 'Not found' });
  message.status = req.body.status || message.status;
  await message.save();
  res.json(message);
}

module.exports = { create, listAdmin, updateStatus };
