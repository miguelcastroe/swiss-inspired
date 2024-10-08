const width = window.innerWidth;
const height = window.innerHeight;

// Select the SVG element for the network visualization
const svg = d3.select('#network')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

// Define the nodes and their types
const nodes = [
  { id: "Andrew Trousdale", group: 1, type: "circle", fixed: true },
  { id: "Interactive Machines", group: 2, type: "hexagon" },
  { id: "Human Expression", group: 2, type: "square" },
  { id: "Positive Psychology", group: 2, type: "triangle" },
  { id: "Evolutionary Systems", group: 2, type: "triangle" },
  { id: "Information", group: 2, type: "circle" }
];

// Define the links between the nodes
const links = [
  { source: "Andrew Trousdale", target: "Interactive Machines" },
  { source: "Andrew Trousdale", target: "Human Expression" },
  { source: "Andrew Trousdale", target: "Positive Psychology" },
  { source: "Andrew Trousdale", target: "Evolutionary Systems" },
  { source: "Andrew Trousdale", target: "Information" }
];

// Initialize the force simulation
const simulation = d3.forceSimulation(nodes)
  .force("link", d3.forceLink(links).id(d => d.id).distance(150))  // Link distance
  .force("charge", d3.forceManyBody().strength(-100))  // Reduce charge strength to make movement gentler
  .force("center", d3.forceCenter(width / 2, height / 2))  // Center the simulation
  .force("collide", d3.forceCollide().radius(40))  // Collision radius
  .on("tick", ticked);

// Create the links (lines) between the nodes
const link = svg.append("g")
  .attr("class", "links")
  .selectAll("line")
  .data(links)
  .enter().append("line")
  .attr("stroke-width", 1)
  .attr("stroke", "#333");

// Create the nodes and assign shapes
const node = svg.append("g")
  .attr("class", "nodes")
  .selectAll("g")
  .data(nodes)
  .enter().append("g")
  .on("click", handleNodeClick);  // Add click handler

// Function to generate different shapes based on the node's type
node.each(function(d) {
  if (d.type === "circle") {
    d3.select(this).append("circle")
      .attr("r", 11)  // Set the radius for circles (22px diameter)
      .attr("fill", "#e0e0e0")
      .attr("stroke", "#333")
      .attr("stroke-width", 2);
  } else if (d.type === "square") {
    d3.select(this).append("rect")
      .attr("width", 22)
      .attr("height", 22)
      .attr("x", -11)
      .attr("y", -11)
      .attr("fill", "#e0e0e0")
      .attr("stroke", "#333")
      .attr("stroke-width", 2);
  } else if (d.type === "hexagon") {
    const hexPath = createHexagonPath(11);
    d3.select(this).append("path")
      .attr("d", hexPath)
      .attr("fill", "#e0e0e0")
      .attr("stroke", "#333")
      .attr("stroke-width", 2);
  } else if (d.type === "triangle") {
    const triPath = createEquilateralTrianglePath(22);
    d3.select(this).append("path")
      .attr("d", triPath)
      .attr("fill", "#e0e0e0")
      .attr("stroke", "#333")
      .attr("stroke-width", 2);
  }
});

// Add text labels to the nodes
node.append("text")
  .text(d => d.id)
  .attr("x", 25)  // Offset the text to avoid overlap
  .attr("y", 5)
  .attr("font-size", "14px")
  .attr("font-family", "Arial");

// Keep the central node static in the middle
simulation.on('tick', () => {
  nodes.forEach(d => {
    if (d.id === 'Andrew Trousdale') {
      d.fx = width / 2;
      d.fy = height / 2;
    }
  });
  ticked();
});

// Apply a gentle, continuous motion (living-like movement)
setInterval(() => {
  nodes.forEach(d => {
    if (d.id !== 'Andrew Trousdale') {  // Skip the central node
      d.x += Math.random() * 1 - 0.5;  // Smaller random movement for gentler behavior
      d.y += Math.random() * 1 - 0.5;

      // Keep nodes within the visible area
      d.x = Math.max(30, Math.min(width - 30, d.x));
      d.y = Math.max(30, Math.min(height - 30, d.y));
    }
  });
  simulation.alpha(0.1).restart();  // Keep the simulation active with small motion
}, 300);  // Update the position every 300 milliseconds

// Function to update the position of nodes and links on each tick
function ticked() {
  link
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y);

  node
    .attr("transform", d => `translate(${d.x},${d.y})`);
}

// Function to create a hexagon shape
function createHexagonPath(radius) {
  const angle = Math.PI / 3;
  let path = "";
  for (let i = 0; i < 6; i++) {
    const x = radius * Math.cos(i * angle);
    const y = radius * Math.sin(i * angle);
    path += `${i === 0 ? "M" : "L"}${x},${y}`;
  }
  return path + "Z";  // Close the path
}

// Function to create an equilateral triangle shape
function createEquilateralTrianglePath(size) {
  const height = (Math.sqrt(3) / 2) * size;
  return `M0,-${height / 2} L${size / 2},${height / 2} L-${size / 2},${height / 2} Z`;
}

// Handle node click to open the modal
function handleNodeClick(event, d) {
  const modal = document.getElementById("myModal");
  const modalTitle = document.getElementById("modalTitle");
  modalTitle.textContent = d.id;  // Set the modal title to the node's name
  modal.style.display = "block";  // Show the modal
}

// Handle modal close
document.querySelector(".close").addEventListener("click", function() {
  document.getElementById("myModal").style.display = "none";  // Close the modal
});
