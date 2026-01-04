import * as pdfjsLib from
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.149/pdf.min.mjs";

(async function () {
    const canvas = document.getElementById('pdfCanvas');
    const progressBar = document.getElementById('ltbase-pdf-progress-bar');

    let currentPage = 1;
    let timeOutId = -1;
    const ctx = canvas.getContext('2d');

    pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.149/pdf.worker.min.mjs";

    const restartProgress = () => {
        if (!progressBar) {
            return;
        }
        if (timeOutId > 0) {
            window.clearTimeout(timeOutId);
        }
        const animations = progressBar.getAnimations();

        animations.forEach(animation => {
            animation.cancel();
            animation.play();
        });
        // progressBar.classList.remove('ltbase-pdf-progress__bar-animating');
        // void progressBar.offsetWidth; // force reflow so the animation restarts
        // progressBar.classList.add('ltbase-pdf-progress__bar-animating');

        timeOutId = window.setTimeout(async () => {
            if (!pdfDoc) {
                return;
            }
            await renderNextPage();
        }, 15000);
    };

    const pdfDoc = await pdfjsLib.getDocument("https://raw.githubusercontent.com/Lychee-Technology/lychee.technology/refs/heads/main/img/LTBase.pdf").promise;
    async function renderPage(num) {
        const page = await pdfDoc.getPage(num);
        const viewport = page.getViewport({ scale: 2.5 });

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };

        await page.render(renderContext).promise;
        currentPage = num;
    }

    const renderNextPage = async () => {
        if (!pdfDoc) {
            return;
        }

        currentPage++;
        if (currentPage > pdfDoc.numPages) {
            currentPage = 1;
        }

        await renderPage(currentPage);
        restartProgress();
    }

    canvas.addEventListener('click', async (e) => {
        await renderNextPage();
    });

    for (let i = pdfDoc.numPages; i >= 1; i--) {
        await renderPage(i);
    }

    canvas.style.visibility = 'visible';
    progressBar.style.visibility = 'visible';
    restartProgress();
})();
