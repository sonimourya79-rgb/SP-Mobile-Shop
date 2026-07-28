// Render's free tier cannot reach Gmail's SMTP ports (outbound SMTP is
// commonly blocked on free/shared hosting tiers), so SMTP just hangs or times
// out no matter how the transport is configured. Brevo's transactional email
// API is plain HTTPS (port 443), which works from any host that can make a
// normal outbound web request.
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const REQUEST_TIMEOUT_MS = 15000;

function parseAddress(input) {
  if (!input) return null;
  const str = String(input).trim();
  const match = str.match(/^(.*)<(.+)>$/);
  if (match) {
    const name = match[1].trim().replace(/^"|"$/g, '');
    const email = match[2].trim();
    return email ? { email, ...(name ? { name } : {}) } : null;
  }
  return str ? { email: str } : null;
}

function toRecipientList(input) {
  if (!input) return [];
  const items = Array.isArray(input) ? input : String(input).split(',');
  return items.map(parseAddress).filter(Boolean);
}

function isConfigured() {
  return Boolean(process.env.BREVO_API_KEY);
}

function senderAddress() {
  return {
    email: process.env.EMAIL_FROM_ADDRESS || process.env.ADMIN_EMAIL,
    name: process.env.EMAIL_FROM_NAME || 'SP Mobile',
  };
}

async function sendMail({ to, bcc, subject, html }) {
  if (!isConfigured()) {
    console.warn('Email not configured (BREVO_API_KEY missing) — skipping send:', subject);
    return { sent: false, reason: 'not_configured' };
  }

  const toList = toRecipientList(to);
  const bccList = toRecipientList(bcc);
  if (toList.length === 0) {
    return { sent: false, reason: 'no_recipient' };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        sender: senderAddress(),
        to: toList,
        ...(bccList.length ? { bcc: bccList } : {}),
        subject,
        htmlContent: html,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(`Brevo API error ${response.status}: ${body.slice(0, 300)}`);
    }
    return { sent: true };
  } catch (err) {
    const reason = err.name === 'AbortError' ? 'Connection timeout' : err.message;
    console.error('Failed to send email:', reason);
    return { sent: false, reason };
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = { sendMail, isConfigured };
