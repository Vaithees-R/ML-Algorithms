document.addEventListener('DOMContentLoaded', () => {
    const originalCanvas = document.getElementById('originalCanvas');
    const reconstructedCanvas = document.getElementById('reconstructedCanvas');
    const singularValuesSlider = document.getElementById('singularValues');
    const kValueSpan = document.getElementById('kValue');
    const svdInfo = document.getElementById('svd-info');
    const imageLoader = document.getElementById('imageLoader');

    let U, S, V; // Stores the SVD components

    // Set initial state
    svdInfo.textContent = "Please upload a PNG or JPG image to begin the simulation.";
    const originalCtx = originalCanvas.getContext('2d');
    originalCtx.fillStyle = '#333';
    originalCtx.fillRect(0,0, originalCanvas.width, originalCanvas.height);
    const reconCtx = reconstructedCanvas.getContext('2d');
    reconCtx.fillStyle = '#333';
    reconCtx.fillRect(0,0, reconstructedCanvas.width, reconstructedCanvas.height);


    // Listen for the user to upload a file
    imageLoader.addEventListener('change', handleImageUpload);

    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            const imageDataUrl = e.target.result;
            loadImageAndPerformSVD(imageDataUrl);
        };
        reader.readAsDataURL(file);
    }

    async function loadImageAndPerformSVD(imageUrl) {
        try {
            svdInfo.textContent = "Loading image and performing SVD... Please wait.";
            singularValuesSlider.disabled = true;

            const image = await Jimp.read(imageUrl);
            image.grayscale().resize(200, 200); // Resize to a standard 200x200 and grayscale

            const width = image.bitmap.width;
            const height = image.bitmap.height;
            
            originalCanvas.width = width;
            originalCanvas.height = height;
            reconstructedCanvas.width = width;
            reconstructedCanvas.height = height;

            const originalImageData = originalCanvas.getContext('2d').createImageData(width, height);
            let originalMatrix = Array(height).fill(0).map(() => Array(width).fill(0));

            image.scan(0, 0, width, height, function(x, y, idx) {
                const gray = this.bitmap.data[idx];
                originalMatrix[y][x] = gray / 255;
                originalImageData.data.set([gray, gray, gray, 255], idx);
            });
            originalCanvas.getContext('2d').putImageData(originalImageData, 0, 0);

            // Perform SVD
            const svdResult = numeric.svd(originalMatrix);
            U = svdResult.U;
            S = svdResult.S;
            V = svdResult.V;
            
            // Setup slider
            singularValuesSlider.max = S.length;
            singularValuesSlider.value = Math.floor(S.length * 0.25);
            singularValuesSlider.disabled = false;
            
            singularValuesSlider.removeEventListener('input', reconstructImage); // Remove old listener if any
            singularValuesSlider.addEventListener('input', reconstructImage);
            
            reconstructImage(); // Perform initial reconstruction

        } catch (error) {
            console.error("Error:", error);
            svdInfo.textContent = "Error: Could not process the image. Please try a different one.";
        }
    }

    function reconstructImage() {
        if (!U || !S || !V) return;

        const k = parseInt(singularValuesSlider.value, 10);
        kValueSpan.textContent = k;

        // Reconstruct matrix using first k singular values
        const Uk = U.map(row => row.slice(0, k));
        const Sk = numeric.diag(S.slice(0, k));
        const Vk_T = numeric.transpose(V).slice(0, k);
        const reconstructedMatrix = numeric.dot(numeric.dot(Uk, Sk), Vk_T);

        const reconCtx = reconstructedCanvas.getContext('2d');
        const imageData = reconCtx.createImageData(reconstructedCanvas.width, reconstructedCanvas.height);

        for (let y = 0; y < reconstructedCanvas.height; y++) {
            for (let x = 0; x < reconstructedCanvas.width; x++) {
                const idx = (y * reconstructedCanvas.width + x) * 4;
                const pixelValue = Math.max(0, Math.min(255, reconstructedMatrix[y][x] * 255));
                imageData.data.set([pixelValue, pixelValue, pixelValue, 255], idx);
            }
        }
        reconCtx.putImageData(imageData, 0, 0);

        const originalDataSize = U.length * V[0].length;
        const compressedDataSize = (U.length * k) + k + (V[0].length * k);
        const compressionRatio = 100 * (1 - (compressedDataSize / originalDataSize));
        svdInfo.textContent = `Using k=${k} values. Data size is compressed by ~${compressionRatio.toFixed(1)}%.`;
    }
});