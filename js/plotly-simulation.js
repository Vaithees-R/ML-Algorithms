document.addEventListener('DOMContentLoaded', () => {
    // Check if the plot container exists
    if (!document.getElementById('plotly-tsne-plot')) return;

    // --- Simulated t-SNE Output Data ---
    const tsne_data_json = [
        { "TSNE-1": 15.2, "TSNE-2": 5.5, "target_name": "Cluster A" }, { "TSNE-1": 14.8, "TSNE-2": 5.2, "target_name": "Cluster A" }, { "TSNE-1": 15.5, "TSNE-2": 5.8, "target_name": "Cluster A" }, { "TSNE-1": 14.9, "TSNE-2": 5.4, "target_name": "Cluster A" }, { "TSNE-1": 15.1, "TSNE-2": 5.3, "target_name": "Cluster A" }, { "TSNE-1": 15.0, "TSNE-2": 5.6, "target_name": "Cluster A" },
        { "TSNE-1": -10.0, "TSNE-2": -8.0, "target_name": "Cluster B" }, { "TSNE-1": -10.3, "TSNE-2": -7.5, "target_name": "Cluster B" }, { "TSNE-1": -9.8, "TSNE-2": -8.3, "target_name": "Cluster B" }, { "TSNE-1": -9.5, "TSNE-2": -7.8, "target_name": "Cluster B" }, { "TSNE-1": -10.1, "TSNE-2": -8.1, "target_name": "Cluster B" }, { "TSNE-1": -9.7, "TSNE-2": -8.5, "target_name": "Cluster B" },
        { "TSNE-1": 0.5, "TSNE-2": 18.0, "target_name": "Cluster C" }, { "TSNE-1": 0.8, "TSNE-2": 17.5, "target_name": "Cluster C" }, { "TSNE-1": 0.2, "TSNE-2": 18.2, "target_name": "Cluster C" }, { "TSNE-1": 0.0, "TSNE-2": 17.9, "target_name": "Cluster C" }, { "TSNE-1": 0.4, "TSNE-2": 17.6, "target_name": "Cluster C" }, { "TSNE-1": 0.6, "TSNE-2": 18.1, "target_name": "Cluster C" },
    ];

    // --- Processing for Plotly ---
    const groups = [...new Set(tsne_data_json.map(d => d.target_name))];
    const data_traces = groups.map(group => {
        const groupData = tsne_data_json.filter(d => d.target_name === group);
        return {
            x: groupData.map(d => d['TSNE-1']),
            y: groupData.map(d => d['TSNE-2']),
            mode: 'markers',
            type: 'scatter',
            name: group,
            marker: { size: 12, opacity: 0.9, line: { width: 1.5, color: '#222' } }
        };
    });

    // --- Plotly Layout Configuration with DARK THEME ---
    const layout = {
        title: {
            text: 'Simulated 2D t-SNE Embedding',
            font: { color: '#ffffff', size: 18 }
        },
        xaxis: {
            title: 't-SNE Component 1',
            zeroline: false,
            gridcolor: 'rgba(255, 255, 255, 0.2)',
            color: '#ffffff'
        },
        yaxis: {
            title: 't-SNE Component 2',
            zeroline: false,
            gridcolor: 'rgba(255, 255, 255, 0.2)',
            color: '#ffffff'
        },
        paper_bgcolor: 'rgba(0,0,0,0)', // Makes background transparent to show page gradient
        plot_bgcolor: 'rgba(0, 0, 0, 0.4)', // Dark, semi-transparent plot area
        hovermode: 'closest',
        autosize: true,
        legend: {
            font: { color: '#ffffff' }
        }
    };

    // --- Render the Plot ---
    Plotly.newPlot('plotly-tsne-plot', data_traces, layout, {responsive: true});
});