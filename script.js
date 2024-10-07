const width = window.innerWidth;
const height = window.innerHeight;

const svg = d3.select("#network-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const nodes = [
    { id: 0, name: "Andrew Trousdale", shape: "circle", x: width / 2, y: height / 2, r: 22 },
    { id: 1, name: "Positive Psychology", shape: "triangle", x: 100, y: 100, r: 22 },
    { id: 2, name: "Interactive Machines", shape: "hexagon", x: 200, y: 200, r: 22 },
    { id: 3, name: "Human Expression", shape: "square", x: 300, y: 300, r: 22 },
    { id: 4, name: "Evolutionary Systems", shape: "triangle", x: 400, y: 400, r: 22 },
    { id: 5, name: "Information", shape: "circle", x: 500, y: 500, r: 22 }
];

const links = [
    { source: 0, target: 1 },
    { source: 0, target: 2 },
    { source: 0, target: 3 },
    { source: 0, target: 4 },
    { source: 0, target: 5 }
];

// Add lines between nodes
const link = svg.selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("x1", d => nodes[d.source].x)
    .attr("y1", d => nodes[d.source].y)
    .attr("x2", d => nodes[d.target].x)
    .attr("y2", d => nodes[d.target].y);

// Add node groups
const node = svg.selectAll(".node")
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "node");

// Function to create the shape of the node based on its type
node.append("path")
    .attr("d", d => generateShape(d))
    .attr("transform", d => `translate(${d.x}, ${d.y})`)
    .attr("class", "shape")
    .on("click", function(event, d) {
        openModal(d);  // Handle click event to open the modal
    });

// Add text labels
node.append("text")
    .attr("x", d => d.x + 25)
    .attr("y", d => d.y + 5)
    .text(d => d.name);

// Function to generate shapes (circle, triangle, square, hexagon)
function generateShape(d) {
    const size = d.r;  // Set the size of shapes to 22px
    switch (d.shape) {
        case "circle":
            return d3.symbol().type(d3.symbolCircle).size(size * size)();
        case "triangle":
            return d3.symbol().type(d3.symbolTriangle).size(size * size)();
        case "square":
            return d3.symbol().type(d3.symbolSquare).size(size * size)();
        case "hexagon":
            return d3.symbol().type(d3.symbolHexagon).size(size * size)();
        default:
            return d3.symbol().type(d3.symbolCircle).size(size * size)();
    }
}

// Force simulation to move nodes around
const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).distance(150))
    .force("charge", d3.forceManyBody().strength(-400))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .on("tick", ticked);

function ticked() {
    // Update positions of lines
    link
        .attr("x1", d => nodes[d.source].x)
        .attr("y1", d => nodes[d.source].y)
        .attr("x2", d => nodes[d.target].x)
        .attr("y2", d => nodes[d.target].y);

    // Update positions of nodes and shapes
    node.selectAll("path")
        .attr("transform", d => `translate(${d.x}, ${d.y})`);

    // Update text labels to stay aligned with shapes
    node.selectAll("text")
        .attr("x", d => d.x + 25)
        .attr("y", d => d.y + 5);
}

// Modal Handling
const modal = document.getElementById("node-modal");
const modalTitle = document.getElementById("modal-title");
const modalContent = document.getElementById("modal-content");
const closeModal = document.getElementsByClassName("close")[0];

// Function to open the modal
function openModal(d) {
    modalTitle.textContent = d.name;  // Set modal title to node name
    modalContent.textContent = "Lorem Ipsum is simply dummy text of the printing and typesetting industry.";  // Example content
    modal.style.display = "block";
}

// Close the modal when the user clicks the 'x'
closeModal.onclick = function() {
    modal.style.display = "none";
};

// Close the modal when the user clicks outside of it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};
