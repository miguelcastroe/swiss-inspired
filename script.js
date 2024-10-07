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
        const size = 11;  // Half of the base width (height will adjust)
        d3.select(this).append("polygon")
            .attr("points", trianglePoints(size))  // Helper function for equilateral triangle
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

// Helper function to generate equilateral triangle points (centered, size is half base width)
function trianglePoints(size) {
    const height = size * Math
