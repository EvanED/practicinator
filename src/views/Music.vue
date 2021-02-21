<template>
    <div class="about">
        <button id="next" @click="next_page">next</button>
        <button id="prev" @click="prev_page">prev</button>
        <canvas id="the-canvas"></canvas>
    </div>
</template>

<script language="ts">
import * as Pdf from 'pdfjs-dist';

let g_prev_page = null;
let g_next_page = null;

async function set_up() {
    const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');

    const url = '/dvorak.pdf';
    Pdf.GlobalWorkerOptions.workerSrc = pdfjsWorker;

    const pdfjsLib = Pdf;

    let pdfDoc = null;
    let pageNum = 1;
    let pageRendering = false;
    let pageNumPending = null;
    const scale = 2;
    const canvas = document.getElementById('the-canvas');
    const ctx = canvas.getContext('2d');

    function renderPage(num) {
        pageRendering = true;
        // Using promise to fetch the page
        pdfDoc.getPage(num).then(function(page) {
            const viewport = page.getViewport({
                scale: scale,
                offsetY: 0,
            });
            canvas.height = 750; //viewport.height;
            canvas.width = viewport.width;

            // Render PDF page into canvas context
            const renderContext = {
                canvasContext: ctx,
                viewport: viewport
            };
            const renderTask = page.render(renderContext);

            // Wait for rendering to finish
            renderTask.promise.then(function() {
                pageRendering = false;
                if (pageNumPending !== null) {
                // New page rendering is pending
                renderPage(pageNumPending);
                pageNumPending = null;
                }
            });
        });
    }

    // If another page rendering in progress, waits until the rendering is
    // finised. Otherwise, executes rendering immediately.
    function queueRenderPage(num) {
        if (pageRendering) {
            pageNumPending = num;
        } else {
            renderPage(num);
        }
    }

    function onPrevPage() {
        if (pageNum <= 1) {
            return;
        }
        pageNum--;
        queueRenderPage(pageNum);
    }

    function onNextPage() {
        if (pageNum >= pdfDoc.numPages) {
            return;
        }
        pageNum++;
        queueRenderPage(pageNum);
    }

    g_prev_page = onPrevPage;
    g_next_page = onNextPage;

    pdfjsLib.getDocument(url).promise.then(function(pdfDoc_) {
        pdfDoc = pdfDoc_;
        renderPage(pageNum);
    });
}

set_up();

export default {
    mounted() {
        window.addEventListener("keydown", this.key_listener);
    },
    unmounted() {
        window.removeEventListener("keydown", this.key_listener);
    },
    methods: {
        prev_page() {
            g_prev_page();
        },
        next_page() {
            g_next_page();
        },
        key_listener(event) {
            if (event.key === "ArrowLeft") {
                this.prev_page();
            }
            else if (event.key === "ArrowRight") {
                this.next_page();
            }
        }
    },
}
</script>