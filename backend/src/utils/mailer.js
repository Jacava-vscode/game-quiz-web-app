import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'

const LOG_DIR = path.join(process.cwd(), 'backend', 'logs')
const LOG_FILE = path.join(LOG_DIR, 'emails.log')

const ensureLogDir = () => {
  try {
    if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true })
  } catch (_) {}
}

let transport = null

const initTransport = () => {
  if (transport) return transport
  // If SMTP env is provided, use real transport
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587', 10),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })
    return transport
  }

  // Default: dev logger transport (no real email sent)
  transport = {
    sendMail: async (mailOptions) => {
      ensureLogDir()
      const out = [
        `--- EMAIL ${new Date().toISOString()} ---`,
        `to: ${mailOptions.to}`,
        `from: ${mailOptions.from || process.env.EMAIL_FROM || 'no-reply'}`,
        `subject: ${mailOptions.subject}`,
        `text: ${mailOptions.text || ''}`,
        `html: ${mailOptions.html || ''}`,
        ''
      ].join('\n')
      // append to log file
      fs.appendFileSync(LOG_FILE, out + '\n')
      // also print to console for convenience
      // eslint-disable-next-line no-console
      console.log(out)
      return Promise.resolve({ accepted: [mailOptions.to] })
    }
  }

  return transport
}

export const sendMail = async ({ to, subject, text, html, from }) => {
  const t = initTransport()
  const mailOptions = {
    from: from || process.env.EMAIL_FROM || 'Game Quiz <no-reply@example.com>',
    to,
    subject,
    text,
    html
  }
  return t.sendMail(mailOptions)
}

export default { sendMail }
