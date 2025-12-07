(function () {
    const partners = [
        {
            site: "https://intnexus.com/",
            logoSrc: "./img/intnexus-logo.webp",
            name: "Australia Intelligence Nexus Group",
            location: "Sydney, Australia"
        },
        {
            site: "https://2718.ai/",
            logoSrc: "./img/enl.webp",
            name: "Euler Number Limited",
            location: "Hong Kong, China"
        },
        {
            site: "https://www.ginkgo.health/",
            logoSrc: "./img/ginkgo-logo.webp",
            name: "Ginkgo Health",
            location: "Vancouver, Canada"
        },
        {
            site: "https://mutziker.com/",
            logoSrc: "./img/m10b-logo.webp",
            name: "Mutziker",
            location: "Hong Kong, China"
        },
        {
            site: "https://www.nanotag.com.au/",
            logoSrc: "./img/nanotag.webp",
            name: "Nanotag Technology",
            location: "Sydney, Australia"
        },
        {
            site: "https://netex.co.jp/",
            logoSrc: "./img/netex-logo.webp",
            name: "Net Explorer",
            location: "Tokyo, Japan"
        },
        {
            site: "https://scudata.com/",
            logoSrc: "./img/mstile-150x150.webp",
            name: "Scudata",
            location: "California, US"
        },
        {
            site: "https://skinat.tmall.com",
            logoSrc: "./img/skinat.svg",
            name: "SkinAt",
            location: "Beijing, China"
        },
        {
            site: "https://codefuture.ai",
            logoSrc: "./img/codefuture-logo.webp",
            name: "Code Future Canada Inc.",
            location: "Toronto, Canada"
        }
    ].sort((a, b) => a.name.localeCompare(b.name));

    function createPartnerCard({ site, logoSrc, name, location }) {
        const card = document.createElement('a');
        card.className = 'partner-card';
        card.href = site;
        card.target = '_blank';
        card.rel = 'noreferrer';
        card.innerHTML = `
            <div class="flex flex-col items-center justify-center gap-2 text-center">
                <img class="h-20 w-auto" data-alt="${name}"
                    src="${logoSrc}">
                <div class="text-white text-sm font-semibold">${name}</div>
                <div class="text-[#92c9a9] text-xs">${location}</div>
            </div>`;
        return card;
    }

    document.addEventListener('DOMContentLoaded', () => {
        const container = document.querySelector('[data-partners-container]');
        const track = document.querySelector('[data-partners-track]');

        const partnerCards = [];
        for (let i = 0; i < 2; i++) {
            partners.forEach(partner => {
                const card = createPartnerCard(partner);
                partnerCards.push(card);
            });
        }
        track.append(...partnerCards);
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
})();