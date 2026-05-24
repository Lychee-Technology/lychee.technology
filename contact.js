const FORM_ENDPOINT = 'https://gforms.lychee.technology/api/v1/forms/1FAIpQLSffdjeHqtd13tYhSRDoStvm8wqZpzB3yek6niGbrg-mMaNTbw/responses';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function mark(selector) {
    document.querySelector(selector)?.classList.add('has-error');
}

function clearErrors(form) {
    form.querySelectorAll('[data-field].has-error').forEach(el => el.classList.remove('has-error'));
}

function setStatus(el, kind, text) {
    if (!el) return;
    el.className = kind === 'error' ? 'label-sm text-error' : 'label-sm text-on-surface-variant';
    el.textContent = text;
}

const LS_KEY = 'ltbase_contact_sent';

function showSuccess() {
    const form = document.getElementById('contact-form');
    const success = document.getElementById('contact-success');
    if (form) form.classList.add('hidden');
    if (success) success.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem(LS_KEY)) {
        showSuccess();
        return;
    }

    const form = document.getElementById('contact-form');
    if (!form) return;
    const status = document.getElementById('form-status');
    const submitBtn = form.querySelector('[type="submit"]');

    form.querySelectorAll('input, textarea').forEach(el => {
        el.addEventListener('input', () => {
            el.closest('[data-field]')?.classList.remove('has-error');
        });
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        clearErrors(form);

        const data = new FormData(form);
        const name = (data.get('name') || '').toString().trim();
        const email = (data.get('email') || '').toString().trim();
        const company = (data.get('company') || '').toString().trim();
        const message = (data.get('message') || '').toString().trim();
        const token = (data.get('cf-turnstile-response') || '').toString().trim();

        let valid = true;

        if (!name) { mark('[data-field="name"]'); valid = false; }
        if (!email || !EMAIL_RE.test(email)) { mark('[data-field="email"]'); valid = false; }
        if (!company) { mark('[data-field="company"]'); valid = false; }
        if (!message) { mark('[data-field="message"]'); valid = false; }
        if (!token) { mark('[data-field="turnstile"]'); valid = false; }

        if (!valid) {
            form.querySelector('[data-field].has-error')?.querySelector('input, textarea')?.focus();
            return;
        }

        submitBtn.disabled = true;
        submitBtn.querySelector('span:first-child').textContent = 'Sending…';

        try {
            const res = await fetch(FORM_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    field_1: name,
                    field_2: email,
                    field_3: company,
                    field_4: message,
                    turnstile_token: token,
                }),
            });

            if (!res.ok) throw new Error(`${res.status}`);

            localStorage.setItem(LS_KEY, '1');
            showSuccess();
        } catch {
            setStatus(status, 'error', 'Something went wrong. Please try again or email us directly at info@lychee.technology.');
            submitBtn.disabled = false;
            submitBtn.querySelector('span:first-child').textContent = 'Send Message';
        }
    });
});
