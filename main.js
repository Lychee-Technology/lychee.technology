import scudataLogo from './img/scudata-logo.webp';
import intnexusLogo from './img/intnexus-logo.webp';
import enlLogo from './img/enl.webp';
import ginkgoLogo from './img/ginkgo-logo.webp';
import m10bLogo from './img/m10b-logo.webp';
import nanoTagLogo from './img/nanotag.webp';
import netexLogo from './img/netex-logo.webp';
import skinAtLogo from './img/skinat.svg';
import codefutureLogo from './img/codefuture-logo.webp';
import _50northLogo from './img/50north-logo.webp';

const partners = [
    { site: "https://intnexus.com/", logoSrc: intnexusLogo, name: "Australia Intelligence Nexus Group", location: "Sydney, Australia" },
    { site: "https://2718.ai/", logoSrc: enlLogo, name: "Euler Number Limited", location: "Hong Kong, China" },
    { site: "https://www.ginkgo.health/", logoSrc: ginkgoLogo, name: "Ginkgo Health", location: "Vancouver, Canada" },
    { site: "https://mutziker.com/", logoSrc: m10bLogo, name: "Mutziker", location: "Hong Kong, China" },
    { site: "https://www.nanotag.com.au/", logoSrc: nanoTagLogo, name: "Nanotag Technology", location: "Sydney, Australia" },
    { site: "https://netex.co.jp/", logoSrc: netexLogo, name: "Net Explorer", location: "Tokyo, Japan" },
    { site: "https://scudata.com/", logoSrc: scudataLogo, name: "Scudata", location: "California, US" },
    { site: "https://skinat.tmall.com", logoSrc: skinAtLogo, name: "SkinAt", location: "Beijing, China" },
    { site: "https://codefuture.ai", logoSrc: codefutureLogo, name: "Code Future Canada Inc.", location: "Toronto, Canada" },
    { site: "https://www.50northfinancial.com", logoSrc: _50northLogo, name: "50 North Financial", location: "Vancouver, Canada" }
].sort((a, b) => a.name.localeCompare(b.name));

function createPartnerCard({ site, logoSrc, name, location }, { showMeta = true } = {}) {
    const card = document.createElement('a');
    card.className = 'partner-card';
    card.href = site;
    card.target = '_blank';
    card.rel = 'noreferrer';
    const logoUrl = new URL(logoSrc, import.meta.url).href;
    card.innerHTML = showMeta
        ? `
            <img data-alt="${name}" src="${logoUrl}">
            <div class="text-on-surface text-sm font-semibold">${name}</div>
            <div class="text-on-surface-variant text-xs">${location}</div>`
        : `
            <img data-alt="${name}" src="${logoUrl}">`;
    return card;
}

export function initPartnerMarquee() {
    const container = document.querySelector('[data-partners-container]');
    const track = document.querySelector('[data-partners-track]');
    if (!container || !track) return;

    const cards = [];
    for (let i = 0; i < 2; i++) {
        partners.forEach(partner => cards.push(createPartnerCard(partner, { showMeta: false })));
    }
    track.append(...cards);

    let offset = 0;
    let rafId = null;
    const speed = 0.6;

    const getGap = () => {
        const styles = getComputedStyle(track);
        const gapValue = styles.columnGap || styles.gap || '0';
        const parsed = parseFloat(gapValue);
        return Number.isNaN(parsed) ? 0 : parsed;
    };

    const tick = () => {
        const gap = getGap();
        offset -= speed;
        const first = track.children[0];
        if (first) {
            const firstWidth = first.getBoundingClientRect().width;
            if (-offset >= firstWidth + gap) {
                track.appendChild(first);
                offset += firstWidth + gap;
            }
        }
        track.style.transform = `translateX(${offset}px)`;
        rafId = requestAnimationFrame(tick);
    };

    let resumeTimeoutId = 0;

    const start = () => {
        if (rafId) return;
        if (resumeTimeoutId) {
            clearTimeout(resumeTimeoutId);
            resumeTimeoutId = 0;
        }
        rafId = requestAnimationFrame(tick);
    };

    const stop = () => {
        if (!rafId) return;
        cancelAnimationFrame(rafId);
        rafId = null;
        resumeTimeoutId = setTimeout(() => {
            start();
            resumeTimeoutId = 0;
        }, 10000);
    };

    container.addEventListener('mouseenter', stop);
    container.addEventListener('mouseleave', start);
    window.addEventListener('blur', stop);
    window.addEventListener('focus', start);
    window.addEventListener('resize', () => {
        offset = 0;
        track.style.transform = 'translateX(0)';
    });

    start();
}

export function initPartnerGrid() {
    const grid = document.querySelector('[data-partners-grid]');
    if (!grid) return;
    partners.forEach(partner => {
        grid.appendChild(createPartnerCard(partner, { showMeta: false }));
    });
}

export function initMobileMenu() {
    const toggle = document.getElementById('menu-toggle');
    const panel = document.getElementById('menu-panel');
    if (!toggle || !panel) return;

    const close = () => {
        panel.classList.add('hidden');
        toggle.setAttribute('aria-expanded', 'false');
    };
    const open = () => {
        panel.classList.remove('hidden');
        toggle.setAttribute('aria-expanded', 'true');
    };

    toggle.addEventListener('click', (event) => {
        event.stopPropagation();
        if (panel.classList.contains('hidden')) open();
        else close();
    });
    panel.addEventListener('click', (event) => event.stopPropagation());
    document.addEventListener('click', close);
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') close();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initPartnerMarquee();
    initPartnerGrid();
    initMobileMenu();
});
