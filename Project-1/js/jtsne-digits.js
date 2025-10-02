// This file uses Plotly.js and tsne.js, which are loaded in the HTML

document.addEventListener('DOMContentLoaded', () => {
    const plotContainer = document.getElementById('tsne-digits-plot');
    if (!plotContainer) return;

    // --- Real-World Digits Data ---
    // A subset of the famous MNIST handwritten digits dataset.
    // 'pca_30d' is the data after being reduced from 64D to 30D with PCA for speed.
    // 'pixels_64d' is the original 8x8 pixel data for drawing the images.
    // 'label' is the actual number (0-9).
    const digitsData = [
        {"pca_30d": [2.1, -0.9, -4.5, -5.2, 0.4, 0.6, -1.2, 0.9, -1.7, -0.7, -0.6, 1.4, 0.5, -0.8, -1.1, -0.9, -1.2, -0.5, 0.3, 0.3, 0.6, 0.1, -0.1, 0.3, -0.4, -0.2, 0.1, 0.0, -0.2, -0.1], "pixels_64d": [0,0,5,13,9,1,0,0,0,0,13,15,10,15,5,0,0,3,15,2,0,11,8,0,0,4,12,0,0,8,8,0,0,5,8,0,0,9,8,0,0,4,11,0,1,12,7,0,0,2,14,5,10,12,0,0,0,0,6,13,10,0,0,0], "label": 0},
        {"pca_30d": [-1.1, -2.9, -0.4, 1.9, -2.0, -1.5, 1.0, -1.3, -1.2, -0.2, 0.7, -0.9, -0.1, -0.6, -0.3, 0.2, 0.1, -0.2, -0.3, -0.1, 0.1, -0.1, 0.0, 0.1, 0.1, 0.0, -0.1, 0.1, 0.0, 0.0], "pixels_64d": [0,0,0,12,13,5,0,0,0,0,0,11,16,9,0,0,0,0,3,15,16,6,0,0,0,7,15,16,16,2,0,0,0,0,1,16,16,3,0,0,0,0,1,16,16,6,0,0,0,0,1,11,16,10,0,0,0,0,0,2,16,4,0,0], "label": 1},
        {"pca_30d": [0.4, 1.9, 0.3, -2.9, 0.8, -1.8, -1.7, -1.9, 0.9, 0.5, -0.3, 0.2, 0.1, 0.1, -0.1, -0.2, 0.0, 0.1, -0.1, -0.1, 0.0, 0.0, 0.0, 0.1, 0.0, 0.0, -0.1, -0.1, 0.0, 0.0], "pixels_64d": [0,0,4,15,12,1,0,0,0,0,12,14,1,12,0,0,0,1,10,0,0,12,0,0,0,0,3,11,8,13,0,0,0,2,1,11,16,10,0,0,0,0,3,16,14,6,0,0,0,0,6,16,12,0,0,0,0,0,7,16,10,0,0,0], "label": 2},
        {"pca_30d": [1.3, -0.2, 2.3, -0.3, -1.7, 0.7, -0.8, 1.1, -0.5, -0.8, -0.9, 0.1, -0.2, -0.2, 0.1, 0.2, -0.1, 0.0, 0.1, -0.1, 0.0, 0.0, -0.1, -0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], "pixels_64d": [0,0,7,15,13,1,0,0,0,8,13,6,15,4,0,0,0,2,1,13,13,0,0,0,0,0,2,15,11,1,0,0,0,0,0,11,8,1,0,0,0,0,1,8,12,14,0,0,0,1,10,13,1,0,0,0,0,0,11,16,10,0,0,0], "label": 3},
        {"pca_30d": [-3.1, 0.4, -0.8, -1.2, 0.3, -0.2, 0.7, -0.9, -0.6, 0.3, 0.3, 0.1, -0.1, -0.1, -0.1, 0.0, 0.1, 0.0, -0.1, 0.0, 0.0, 0.0, 0.0, -0.1, 0.0, 0.0, -0.1, -0.1, 0.0, 0.0], "pixels_64d": [0,0,0,1,11,0,0,0,0,0,0,7,8,0,0,0,0,0,1,13,6,0,0,0,0,1,10,13,0,0,0,0,0,0,0,14,10,1,0,0,0,0,0,12,14,4,0,0,0,0,0,12,16,9,0,0,0,0,0,3,12,1,0,0], "label": 4},
        // ... A lot more data points would be here in a full file.
        // For this example, we'll generate the rest to keep the code block size manageable.
    ];

    // --- Generate more data points to simulate a larger dataset ---
    const numClasses = 10;
    const pointsPerClass = 50;
    for (let i = 0; i < numClasses * pointsPerClass; i++) {
        const base = digitsData[i % digitsData.length];
        const new_pca = base.pca_30d.map(v => v + (Math.random() - 0.5) * 2);
        const new_pixels = base.pixels_64d.map(v => Math.min(16, Math.max(0, v + Math.floor((Math.random() - 0.5) * 4))));
        digitsData.push({ "pca_30d": new_pca, "pixels_64d": new_pixels, "label": i % numClasses });
    }

    const dataForTSNE = digitsData.map(d => d.pca_30d);

    // --- Run t-SNE ---
    const tsne = new TSNE({ epsilon: 10, perplexity: 30, dim: 2 });
    tsne.init({ data: dataForTSNE, type: 'dense' });
    tsne.run();
    const tsneOutput = tsne.getSolution();

    // --- Prepare Data for Plotly ---
    const classColors = ['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999','#e41a1c'];
    const dataTraces = Array.from({ length: 10 }, (_, i) => ({
        x: [],
        y: [],
        text: [],
        customdata: [],
        mode: 'markers',
        type: 'scatter',
        name: `Digit ${i}`,
        marker: { color: classColors[i], size: 8, opacity: 0.8 }
    }));

    tsneOutput.forEach((point, i) => {
        const digit = digitsData[i];
        dataTraces[digit.label].x.push(point[0]);
        dataTraces[digit.label].y.push(point[1]);
        dataTraces[digit.label].text.push(`Digit: ${digit.label}`);
        dataTraces[digit.label].customdata.push(digit.pixels_64d);
    });

    // --- Plotly Layout ---
    const layout = {
        title: { text: 't-SNE of Handwritten Digits', font: { color: '#ffffff' } },
        xaxis: { title: 't-SNE Component 1', gridcolor: '#444', color: '#ffffff', zeroline: false },
        yaxis: { title: 't-SNE Component 2', gridcolor: '#444', color: '#ffffff', zeroline: false },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(42, 42, 42, 0.6)',
        hovermode: 'closest',
        legend: { font: { color: '#ffffff' } },
        autosize: true
    };

    Plotly.newPlot('tsne-digits-plot', dataTraces, layout, { responsive: true });

    // --- Interactive Hover Logic ---
    const plotDiv = document.getElementById('tsne-digits-plot');
    const tooltip = document.getElementById('digit-tooltip');
    const canvas = document.getElementById('digit-canvas');
    const ctx = canvas.getContext('2d');
    const digitLabel = document.getElementById('digit-label');

    plotDiv.on('plotly_hover', (data) => {
        const point = data.points[0];
        const pixelData = point.customdata;
        const label = point.data.name;

        // Draw the digit image
        ctx.clearRect(0, 0, 80, 80);
        const pixelSize = 10;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const pixelValue = pixelData[i * 8 + j];
                const grayscale = 255 - (pixelValue / 16) * 255;
                ctx.fillStyle = `rgb(${grayscale}, ${grayscale}, ${grayscale})`;
                ctx.fillRect(j * pixelSize, i * pixelSize, pixelSize, pixelSize);
            }
        }
        digitLabel.innerText = label;
        
        // Position and show tooltip
        const { xaxis, yaxis } = point;
        const xPx = xaxis.l2p(point.x) + xaxis._offset;
        const yPx = yaxis.l2p(point.y) + yaxis._offset;
        tooltip.style.left = `${xPx + 15}px`;
        tooltip.style.top = `${yPx - 40}px`;
        tooltip.style.opacity = '1';

    }).on('plotly_unhover', (data) => {
        tooltip.style.opacity = '0';
    });
});