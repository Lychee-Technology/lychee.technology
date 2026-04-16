const CONTACT_EMAIL = 'info@lychee.technology';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function showStatus(el, kind, message) {
    if (!el) return;
    el.classList.remove('hidden', 'text-error', 'text-on-surface-variant');
    el.classList.add(kind === 'error' ? 'text-error' : 'text-on-surface-variant');
    el.textContent = message;
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    if (!form) return;
    const status = document.getElementById('form-status');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const data = new FormData(form);
        const name = (data.get('name') || '').toString().trim();
        const email = (data.get('email') || '').toString().trim();
        const company = (data.get('company') || '').toString().trim();
        const message = (data.get('message') || '').toString().trim();

        if (!name || !email || !message) {
            showStatus(status, 'error', 'Please fill in your name, work email, and message.');
            return;
        }
        if (!EMAIL_RE.test(email)) {
            showStatus(status, 'error', 'Please enter a valid work email address.');
            return;
        }

        const subject = `LTBASE inquiry from ${name}${company ? ` (${company})` : ''}`;
        const body = [
            `Name: ${name}`,
            `Email: ${email}`,
            company ? `Company: ${company}` : null,
            '',
            message
        ].filter(Boolean).join('\n');

        const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = href;

        showStatus(status, 'info', 'Opening your mail client…');
    });
});
