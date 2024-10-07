const width = window.innerWidth;
const height = window.innerHeight;

const svg = d3.select("#network-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const nodes = [
    { id: 0, name: "Andrew Trousdale", shape: "circle", x: width / 2, y: height / 2 },
    { id: 1, name: "Positive Psychology", shape: "triangle", x: 100, y: 100 },
    { id: 2, name: "Interactive Machines", shape: "hexagon", x: 200, y: 200 },
    { id: 3, name: "Human Expression", shape: "square", x: 300, y: 300 },
    { id: 4, name: "Evolutionary Systems", shape: "triangle", x: 400, y: 400 },
    { id: 5, name: "Information", shape: "circle", x: 500, y: 500 }
];

const links = [
    { source: 0, target: 1 },
    { source: 0, target: 2 },
    { source: 0, target: 3 },
    { source: 0, target: 4 },
    { source: 0, target: 5 }
];

// Create links
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
    .attr("class", "node")
    .on("click", function(event, d) {
        openModal(d);  // Handle click event to open the modal
    });

// Add shapes
node.append("path")
    .attr("d", function(d) {
        switch(d.shape) {
            case "circle":
                return d3.symbol().type(d3.symbolCircle).size(380)();
            case "square":
                return d3.symbol().type(d3.symbolSquare).size(380)();
            case "hexagon":
                return d3.symbol().type(d3.symbolHexagon).size(380)();
            case "triangle":
                return d3.symbol().type(d3.symbolTriangle).size(380)();
        }
    })
    .attr("transform", d => `translate(${d.x}, ${d.y})`);

// Add text labels to each node
node.append("text")
    .attr("dx", d => d.x + 25)
    .attr("dy", d => d.y)
    .text(d => d.name);

// Force simulation to move nodes around
const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).distance(100))
    .force("charge", d3.forceManyBody().strength(-150))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collision", d3.forceCollide().radius(40))
    .on("tick", ticked);

function ticked() {
    // Update positions of lines
    link
        .attr("x1", d => nodes[d.source].x)
        .attr("y1", d => nodes[d.source].y)
        .attr("x2", d => nodes[d.target].x)
        .attr("y2", d => nodes[d.target].y);

    // Update positions of nodes
    node.attr("transform", d => `translate(${d.x}, ${d.y})`);
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
