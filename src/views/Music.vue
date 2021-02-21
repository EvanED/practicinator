<template>
  <div class="about">
    <canvas id="the-canvas"></canvas>
  </div>
</template>

<script language="ts">
import * as Pdf from 'pdfjs-dist';

async function set_up() {
    const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');

    const url = '/dvorak.pdf';
    Pdf.GlobalWorkerOptions.workerSrc = pdfjsWorker;

    const pdfjsLib = Pdf;

    const loadingTask = pdfjsLib.getDocument(url);
    loadingTask.promise.then(function(pdf) {
        console.log('PDF loaded');
        
        // Fetch the first page
        const pageNumber = 1;
        pdf.getPage(pageNumber).then(function(page) {
            console.log('Page loaded');
            
            const scale = 0.7;
            const viewport = page.getViewport({scale: scale});

            // Prepare canvas using PDF page dimensions
            const canvas = document.getElementById('the-canvas');
            console.log("canvas")
            console.log(canvas)
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // Render PDF page into canvas context
            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            const renderTask = page.render(renderContext);
            renderTask.promise.then(function () {
                console.log('Page rendered');
            });
        });
    }, function (reason) {
        // PDF loading error
        console.error(reason);
    });
}

set_up();

export default {
  
}
</script>