import * as pdfjsLib from
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.149/pdf.min.mjs";

(async function () {
    const canvas = document.getElementById('pdfCanvas');

    let currentPage = 1;
    const ctx = canvas.getContext('2d');

    pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.149/pdf.worker.min.mjs";

    const pdfDoc = await pdfjsLib.getDocument("https://raw.githubusercontent.com/Lychee-Technology/lychee.technology/refs/heads/main/img/LTBase.pdf").promise;
    async function renderPage(num) {
        const page = await pdfDoc.getPage(num);
        const viewport = page.getViewport({ scale: 1.5 });

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };

        await page.render(renderContext).promise;
        currentPage = num;
    }

    canvas.addEventListener('click', (e) => {
        if (!pdfDoc) {
            return;
        }

        if (currentPage >= pdfDoc.numPages) {
            currentPage = currentPage % pdfDoc.numPages;
        }
        currentPage++;

        renderPage(currentPage);
    });

    for (let i = pdfDoc.numPages; i >= 1; i--) {
        await renderPage(i);
    }
    
    canvas.style.visibility = 'visible';
})();