// Tailwind CDN configuration
window.tailwind = window.tailwind || {};
window.tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#13ec6d",
                "background-light": "#f6f8f7",
                "background-dark": "#102218",
            },
            fontFamily: {
                "display": ["Space Grotesk", "sans-serif"]
            },
            borderRadius: {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "full": "9999px"
            },
        },
    },
};

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('[data-partners-container]');
    const track = document.querySelector('[data-partners-track]');
    const cc = track ? track.children.length : 0;

    if (cc > 1) {
        for (let i = 0; i < cc; i++) {
            const element = track.children[i];
            const clone = element.cloneNode(true);
            track.appendChild(clone);
        }   
    }
   

    if (container && track && track.children.length) {
        let offset = 0;
        let rafId = null;
        const speed = 0.6; // px per frame

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

        const start = () => {
            if (rafId) return;
            rafId = requestAnimationFrame(tick);
        };

        const stop = () => {
            if (!rafId) return;
            cancelAnimationFrame(rafId);
            rafId = null;
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

    const toggle = document.getElementById('menu-toggle');
    const panel = document.getElementById('menu-panel');
    if (toggle && panel) {
        const closeMenu = () => {
            panel.classList.add('hidden');
            toggle.setAttribute('aria-expanded', 'false');
        };

        const openMenu = () => {
            panel.classList.remove('hidden');
            toggle.setAttribute('aria-expanded', 'true');
        };

        toggle.addEventListener('click', (event) => {
            event.stopPropagation();
            if (panel.classList.contains('hidden')) {
                openMenu();
            } else {
                closeMenu();
            }
        });

        panel.addEventListener('click', (event) => {
            event.stopPropagation();
        });

        document.addEventListener('click', closeMenu);
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeMenu();
            }
        });
    }
});
