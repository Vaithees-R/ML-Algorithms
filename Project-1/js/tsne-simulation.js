document.addEventListener('DOMContentLoaded', () => {
    const tsneContainer = document.getElementById('tsne-container');
    const tsneCanvas = document.getElementById('tsne-canvas');
    const tsneExplanation = document.getElementById('tsne-explanation');

    if (!tsneContainer || !tsneCanvas) {
        console.warn("t-SNE container or canvas not found. Skipping simulation.");
        return;
    }

    const width = tsneContainer.clientWidth;
    const height = tsneContainer.clientHeight;

    // --- Three.js Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: tsneCanvas, antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    camera.position.z = 100;

    // --- OrbitControls (User Interaction) ---
    // Initialize controls here, they will be enabled later
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 50;
    controls.maxDistance = 300;
    controls.enabled = false; // Start disabled

    // --- Data Generation ---
    const numClasses = 10;
    const pointsPerClass = 50;
    const dimensionality = 64;
    const originalData = [];
    const colors = [];
    const classColors = [ 0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff, 0xffa500, 0x800080, 0x008000, 0x424242 ];

    for (let c = 0; c < numClasses; c++) {
        const classCentroid = Array(dimensionality).fill(0).map(() => Math.random() * 50);
        for (let i = 0; i < pointsPerClass; i++) {
            const point = classCentroid.map(val => val + (Math.random() - 0.5) * 20);
            originalData.push(point);
            colors.push(classColors[c]);
        }
    }

    // --- t-SNE Configuration ---
    const opt = { epsilon: 10, perplexity: 30, dim: 3 };
    const tsne = new TSNE(opt);
    tsneExplanation.textContent = "Running t-SNE algorithm... this might take a moment.";
    tsne.init({ data: originalData, type: 'dense' });

    // --- Geometry Setup ---
    const numIterations = 500;
    let currentIteration = 0;
    const positions = new Float32Array(originalData.length * 3);
    const pointColors = new Float32Array(originalData.length * 3);
    colors.forEach((c, i) => {
        const color = new THREE.Color(c);
        pointColors.set([color.r, color.g, color.b], i * 3);
    });

    const dataPointsGeometry = new THREE.BufferGeometry();
    dataPointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    dataPointsGeometry.setAttribute('color', new THREE.BufferAttribute(pointColors, 3));

    const pointMaterial = new THREE.PointsMaterial({ size: 2, vertexColors: true, transparent: true, opacity: 0.8 });
    const points = new THREE.Points(dataPointsGeometry, pointMaterial);
    scene.add(points);

    // --- Animation Loop ---
    function animateTSNE() {
        requestAnimationFrame(animateTSNE);

        if (currentIteration < numIterations) {
            tsne.step();
            // **FIX #1: Corrected this broken line**
            const Y = tsne.getSolution(); // Y is the t-SNE output

            for (let i = 0; i < Y.length; i++) {
                positions.set([Y[i][0] * 5, Y[i][1] * 5, Y[i][2] * 5], i * 3);
            }
            dataPointsGeometry.attributes.position.needsUpdate = true;
            currentIteration++;
            tsneExplanation.textContent = `t-SNE Iteration: ${currentIteration} / ${numIterations}`;
            
            // Initial cinematic camera rotation
            camera.position.x = Math.sin(currentIteration * 0.02) * 100;
            camera.position.y = Math.cos(currentIteration * 0.015) * 80;
            camera.lookAt(scene.position);

        } else if (!controls.enabled) {
            controls.enabled = true; // Enable user controls after iterations are done
            tsneExplanation.textContent = "t-SNE visualization complete! Drag to explore the 3D clusters.";
        }
        
        // **FIX #2: Added controls.update() for smooth damping**
        if (controls.enabled) {
            controls.update();
        }

        renderer.render(scene, camera);
    }

    // Handle window resizing
    window.addEventListener('resize', () => {
        const newWidth = tsneContainer.clientWidth;
        const newHeight = tsneContainer.clientHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
    });

    // Start the animation
    animateTSNE();
});document.addEventListener('DOMContentLoaded', () => {
    const tsneContainer = document.getElementById('tsne-container');
    const tsneCanvas = document.getElementById('tsne-canvas');
    const tsneExplanation = document.getElementById('tsne-explanation');

    if (!tsneContainer || !tsneCanvas) {
        console.warn("t-SNE container or canvas not found. Skipping simulation.");
        return;
    }

    const width = tsneContainer.clientWidth;
    const height = tsneContainer.clientHeight;

    // --- Three.js Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: tsneCanvas, antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    camera.position.z = 100;

    // --- OrbitControls (User Interaction) ---
    // Initialize controls here, they will be enabled later
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 50;
    controls.maxDistance = 300;
    controls.enabled = false; // Start disabled

    // --- Data Generation ---
    const numClasses = 10;
    const pointsPerClass = 50;
    const dimensionality = 64;
    const originalData = [];
    const colors = [];
    const classColors = [ 0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff, 0xffa500, 0x800080, 0x008000, 0x424242 ];

    for (let c = 0; c < numClasses; c++) {
        const classCentroid = Array(dimensionality).fill(0).map(() => Math.random() * 50);
        for (let i = 0; i < pointsPerClass; i++) {
            const point = classCentroid.map(val => val + (Math.random() - 0.5) * 20);
            originalData.push(point);
            colors.push(classColors[c]);
        }
    }

    // --- t-SNE Configuration ---
    const opt = { epsilon: 10, perplexity: 30, dim: 3 };
    const tsne = new TSNE(opt);
    tsneExplanation.textContent = "Running t-SNE algorithm... this might take a moment.";
    tsne.init({ data: originalData, type: 'dense' });

    // --- Geometry Setup ---
    const numIterations = 500;
    let currentIteration = 0;
    const positions = new Float32Array(originalData.length * 3);
    const pointColors = new Float32Array(originalData.length * 3);
    colors.forEach((c, i) => {
        const color = new THREE.Color(c);
        pointColors.set([color.r, color.g, color.b], i * 3);
    });

    const dataPointsGeometry = new THREE.BufferGeometry();
    dataPointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    dataPointsGeometry.setAttribute('color', new THREE.BufferAttribute(pointColors, 3));

    const pointMaterial = new THREE.PointsMaterial({ size: 2, vertexColors: true, transparent: true, opacity: 0.8 });
    const points = new THREE.Points(dataPointsGeometry, pointMaterial);
    scene.add(points);

    // --- Animation Loop ---
    function animateTSNE() {
        requestAnimationFrame(animateTSNE);

        if (currentIteration < numIterations) {
            tsne.step();
            // **FIX #1: Corrected this broken line**
            const Y = tsne.getSolution(); // Y is the t-SNE output

            for (let i = 0; i < Y.length; i++) {
                positions.set([Y[i][0] * 5, Y[i][1] * 5, Y[i][2] * 5], i * 3);
            }
            dataPointsGeometry.attributes.position.needsUpdate = true;
            currentIteration++;
            tsneExplanation.textContent = `t-SNE Iteration: ${currentIteration} / ${numIterations}`;
            
            // Initial cinematic camera rotation
            camera.position.x = Math.sin(currentIteration * 0.02) * 100;
            camera.position.y = Math.cos(currentIteration * 0.015) * 80;
            camera.lookAt(scene.position);

        } else if (!controls.enabled) {
            controls.enabled = true; // Enable user controls after iterations are done
            tsneExplanation.textContent = "t-SNE visualization complete! Drag to explore the 3D clusters.";
        }
        
        // **FIX #2: Added controls.update() for smooth damping**
        if (controls.enabled) {
            controls.update();
        }

        renderer.render(scene, camera);
    }

    // Handle window resizing
    window.addEventListener('resize', () => {
        const newWidth = tsneContainer.clientWidth;
        const newHeight = tsneContainer.clientHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
    });

    // Start the animation
    animateTSNE();
});