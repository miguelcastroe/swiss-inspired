// Set the dimensions of the visualization
const width = window.innerWidth;
const height = window.innerHeight;

// Create the SVG container
const svg = d3.select("#network-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Define the nodes and links with geometric shapes
const nodes = [
    { id: "Andrew Trousdale", group: 1, shape: "circle", fixed: true }, // Center node
    { id: "Information", group: 1, shape: "circle" },
    { id: "Interactive Machines", group: 2, shape: "hexagon" },
    { id: "Human Expression", group: 2, shape: "square" },
    { id: "Evolutionary Systems", group: 3, shape: "triangle" },
    { id: "Positive Psychology", group: 3, shape: "triangle" }
];

const links = [
    { source: "Andrew Trousdale", target: "Information", value: 1 },
    { source: "Andrew Trousdale", target: "Interactive Machines", value: 1 },
    { source: "Andrew Trousdale", target: "Human Expression", value: 1 },
    { source: "Human Expression", target: "Evolutionary Systems", value: 1 },
    { source: "Positive Psychology", target: "Andrew Trousdale", value: 1 }
];

// Set up the force simulation
const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(150))
    .force("charge", d3.forceManyBody().strength(-100))
    .force("collision", d3.forceCollide().radius(40)) // Ensure spacing to prevent overlap
    .alphaDecay(0.01) // Slow decay for gentle movement
    .velocityDecay(0.4); // Reduce velocity decay for smoother, continuous movement

// Add links (lines) between the nodes
const link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links)
    .enter().append("line")
    .attr("stroke", "#333")
    .attr("stroke-width", 1);

// Add nodes with shapes and labels
const node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("g")
    .data(nodes)
    .enter().append("g");

// Draw different geometrical shapes based on node data
node.each(function (d) {
    if (d.shape === "circle") {
        d3.select(this).append("circle")
            .attr("r", 11)  // Circle with radius 11px to make diameter 22px
            .attr("class", "shape circle");
    } else if (d.shape === "hexagon") {
        const size = 11; // For a regular hexagon with a width of 22px
        d3.select(this).append("polygon")
            .attr("points", hexagonPoints(size))  // Helper function below
            .attr("class", "shape hexagon");
    } else if (d.shape === "square") {
        d3.select(this).append("rect")
            .attr("width", 22)
            .attr("height", 22)
            .attr("x", -11)  // Center the square
            .attr("y", -11)
            .attr("class", "shape square");
    } else if (d.shape === "triangle") {
        const size = 11;  // For an equilateral triangle with a height of 22px
        d3.select(this).append("polygon")
            .attr("points", trianglePoints(size))  // Helper function below
            .attr("class", "shape triangle");
    }
});

// Helper function to generate hexagon points (for regular hexagon with given size)
function hexagonPoints(size) {
    const angle = Math.PI / 3;
    return Array.from({ length: 6 }, (_, i) => [
        size * Math.cos(angle * i),
        size * Math.sin(angle * i)
    ]).map(p => p.join(",")).join(" ");
}

// Helper function to generate equilateral triangle points (centered, size is 11px)
function trianglePoints(size) {
    const height = size * Math.sqrt(3); // Height of equilateral triangle
    return `0,${-height / 2} ${-size},${height / 2} ${size},${height / 2}`;
}


// Add text labels next to each node with more space to prevent overlap
node.append("text")
    .attr("class", "label")
    .attr("x", 25)  // Add more space to avoid overlap
    .attr("y", 5)
    .text(d => d.id);

// Hover effects for interactivity
node.on("mouseover", function () {
    d3.select(this).select(".shape")
        .transition()
        .duration(300)
        .attr("fill", "#666");

    d3.select(this).select(".label")
        .transition()
        .duration(300)
        .style("font-weight", "bold");
})
    .on("mouseout", function () {
        d3.select(this).select(".shape")
            .transition()
            .duration(300)
            .attr("fill", "#e0e0e0");

        d3.select(this).select(".label")
            .transition()
            .duration(300)
            .style("font-weight", "normal");
    });

// Update simulation on tick to move nodes and lines
simulation.on("tick", () => {
    // Keep the center node fixed at the center of the screen
    const centerNode = nodes.find(d => d.id === "Andrew Trousdale");
    centerNode.fx = width / 2;
    centerNode.fy = height / 2;

    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node
        .attr("transform", d => `translate(${d.x},${d.y})`);
});

// Gentle floating effect
function floatEffect() {
    nodes.forEach(d => {
        if (!d.fixed) {  // Only apply to non-fixed nodes
            d.vx += (Math.random() - 0.5) * 0.01;
            d.vy += (Math.random() - 0.5) * 0.01;
        }
    });

    simulation.alpha(0.1).restart();  // Keep simulation running with subtle effects
}

// Continuously apply floating effect at a relaxed interval
d3.interval(() => {
    floatEffect();
}, 3000);  // Slow interval for relaxed movement

// Zoom and Pan functionality
const zoom = d3.zoom()
    .scaleExtent([0.5, 5])
    .on("zoom", (event) => {
        svg.attr("transform", event.transform);
    });

svg.call(zoom);
