import { useRef, useState } from 'react'

const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || 'infoname@mail.com'

function AttachIcon() {
  return <svg viewBox="0 0 18 18" aria-hidden="true"><path d="M6.2 13.7 13 6.9a3 3 0 0 0-4.2-4.2L2.7 8.8a4.2 4.2 0 0 0 5.9 5.9l5.7-5.7M5.8 11.6l5.9-5.9" /></svg>
}

function ArrowIcon() {
  return <svg viewBox="0 0 30 30" aria-hidden="true"><path d="M7.5 15h14M16.5 9.5 22 15l-5.5 5.5" /></svg>
}

function InstagramIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="5" /><circle cx="12" cy="12" r="3.5" /><circle cx="17.4" cy="6.8" r="1" className="dot" /></svg>
}

function App() {
  const fileInput = useRef(null)
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('')
  const [sending, setSending] = useState(false)

  const submit = async event => {
    event.preventDefault()
    setSending(true)
    setStatus('')
    const form = event.currentTarget
    const data = new FormData(form)
    if (file) data.set('attachment', file)

    try {
      const response = await fetch('/api/contact', { method: 'POST', body: data })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.message || 'Unable to send message')
      form.reset()
      setFile(null)
      setStatus('Message sent successfully')
    } catch (error) {
      setStatus(error.message || 'Unable to send message')
    } finally {
      setSending(false)
    }
  }

  return (
    <main className="page">
      <div className="content">
        <section className="intro-section">
          <div className="section-label">Contact Me<span /></div>
          <div className="intro-grid">
            <h1>Let me know if you want to talk<br className="desktop-break" /> about a potential collaboration.<br className="desktop-break" /> I'm available for freelance work.</h1>
            <a className="contact-email" href={`mailto:${contactEmail}`}>{contactEmail}</a>
          </div>
        </section>

        <form className="contact-form" onSubmit={submit} encType="multipart/form-data">
          <input className="field" name="name" type="text" placeholder="What’s your name?" aria-label="Name" maxLength="100" required />
          <input className="field" name="email" type="email" placeholder="Your email" aria-label="Email" maxLength="160" required />
          <input className="field" name="project" type="text" placeholder="Tell me about your project" aria-label="Project description" maxLength="3000" required />
          <input ref={fileInput} className="file-input" name="attachment" type="file" onChange={event => setFile(event.target.files?.[0] || null)} />

          <div className="form-actions">
            <button className="quote-button" type="submit" disabled={sending}>{sending ? 'Sending...' : 'Get a Quote'}</button>
            <div className="right-actions">
              {file && <span className="file-name" title={file.name}>{file.name}</span>}
              <button className="icon-button attach-button" type="button" aria-label="Attach file" title={file?.name || 'Attach file'} onClick={() => fileInput.current?.click()}><AttachIcon /></button>
              <button className="icon-button arrow-button" type="submit" aria-label="Send message" disabled={sending}><ArrowIcon /></button>
            </div>
          </div>
          {status && <p className="form-status" role="status">{status}</p>}
        </form>

        <section className="friends">
          <h2>Let’s be Friends</h2>
          <div className="socials">
            {[1, 2, 3].map(item => <a key={item} className="social-link" href="https://instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram"><InstagramIcon /></a>)}
          </div>
        </section>
      </div>
    </main>
  )
}

export default App
