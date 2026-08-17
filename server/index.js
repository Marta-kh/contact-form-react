import 'dotenv/config'
import express from 'express'
import multer from 'multer'
import nodemailer from 'nodemailer'
import path from 'node:path'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const app = express()
const port = Number(process.env.PORT || 3001)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 1, fields: 3 }
})

const smtpPort = Number(process.env.SMTP_PORT || 587)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: smtpPort,
  secure: process.env.SMTP_SECURE === 'true' || smtpPort === 465,
  auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  } : undefined
})

const text = (value, max) => String(value || '').trim().slice(0, max)
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

app.post('/api/contact', upload.single('attachment'), async (req, res) => {
  const name = text(req.body.name, 100)
  const email = text(req.body.email, 160)
  const project = text(req.body.project, 3000)

  if (!name || !emailPattern.test(email) || !project) {
    return res.status(400).json({ message: 'Please complete all fields with a valid email' })
  }

  const from = process.env.MAIL_FROM || process.env.SMTP_USER
  if (!process.env.SMTP_HOST || !from || !process.env.MAIL_TO) {
    return res.status(500).json({ message: 'Email service is not configured' })
  }

  try {
    await transporter.sendMail({
      from,
      to: process.env.MAIL_TO,
      replyTo: email,
      subject: `New contact request from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nProject:\n${project}`,
      attachments: req.file ? [{
        filename: path.basename(req.file.originalname),
        content: req.file.buffer,
        contentType: req.file.mimetype
      }] : []
    })
    res.json({ message: 'Message sent successfully' })
  } catch {
    res.status(502).json({ message: 'Unable to send message' })
  }
})

const root = path.dirname(fileURLToPath(import.meta.url))
const dist = path.resolve(root, '../dist')
if (existsSync(dist)) {
  app.use(express.static(dist))
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api/')) return res.sendFile(path.join(dist, 'index.html'))
    next()
  })
}

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({ message: error.code === 'LIMIT_FILE_SIZE' ? 'Attachment is too large' : 'Invalid attachment' })
  }
  next(error)
})

app.listen(port, () => console.log(`Server running on http://localhost:${port}`))
