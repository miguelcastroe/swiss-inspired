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
  { id: "Andrew Trousdale", group: 1, shape: "circle" },
  { id: "Information", group: 1, shape: "circle" },
  { id: "Interactive Machines", group: 2, shape: "hexagon" },
  { id: "Human Expression", group: 2, shape: "square" },
  { id: "Evolutionary Systems", group: 3, shape: "triangle" },
  { id: "Positive Psychology", group: 3, shape: "triangle" }
  // Add more nodes as needed
];

const links = [
  { source: "Andrew Trousdale", target: "Information", value: 1 },
  { source: "Andrew Trousdale", target: "Interactive Machines", value: 1 },
  { source: "Andrew Trousdale", target: "Human Expression", value: 1 },
  { source: "Human Expression", target: "Evolutionary Systems", value: 1 },
  { source: "Positive Psychology", target: "Andrew Trousdale", value: 1 }
  // Add more links as needed
];

// Set up the force simulation
const simulation = d3.forceSimulation(nodes)
  .force("link", d3.forceLink(links).id(d => d.id).distance(150))
  .force("charge", d3.forceManyBody().strength(-300))
  .force("center", d3.forceCenter(width / 2, height / 2));

// Add links (lines) between the nodes
const link = svg.append("g")
  .attr("class", "links")
  .selectAll("line")
  .data(links)
  .enter().append("line")
  .attr("stroke", "#333")
  .attr("stroke-width", 1)
  .attr("class", d => d.dotted ? "dotted-line" : "line");

// Add nodes with shapes and labels
const node = svg.append("g")
  .attr("class", "nodes")
  .selectAll("g")
  .data(nodes)
  .enter().append("g");

// Draw different geometrical shapes based on node data
node.each(function(d) {
  if (d.shape === "circle") {
    d3.select(this).append("circle")
      .attr("r", 21)
      .attr("class", "shape circle");
  } else if (d.shape === "hexagon") {
    d3.select(this).append("polygon")
      .attr("points", "12,-21 24,0 12,21 -12,21 -24,0 -12,-21")
      .attr("class", "shape hexagon");
  } else if (d.shape === "square") {
    d3.select(this).append("rect")
      .attr("width", 42)
      .attr("height", 42)
      .attr("x", -21)
      .attr("y", -21)
      .attr("class", "shape square");
  } else if (d.shape === "triangle") {
    d3.select(this).append("polygon")
      .attr("points", "0,-21 18,21 -18,21")
      .attr("class", "shape triangle");
  }
});

// Add text labels next to each node
node.append("text")
  .attr("class", "label")
  .attr("x", 30) // Adjust spacing between shape and text
  .attr("y", 5)
  .text(d => d.id);

// Add hover effects for interactivity
node.on("mouseover", function() {
  d3.select(this).select(".shape")
    .transition()
    .duration(300)
    .attr("fill", "#666");  // Highlight color on hover
  
  d3.select(this).select(".label")
    .transition()
    .duration(300)
    .style("font-weight", "bold");
})
.on("mouseout", function() {
  d3.select(this).select(".shape")
    .transition()
    .duration(300)
    .attr("fill", "#e0e0e0");  // Reset color on mouse out
  
  d3.select(this).select(".label")
    .transition()
    .duration(300)
    .style("font-weight", "normal");
});

// Update simulation on tick to move nodes and lines
simulation.on("tick", () => {
  link
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y);

  node
    .attr("transform", d => `translate(${d.x},${d.y})`)
    .transition()
    .duration(1000)
    .ease(d3.easeCubicInOut);
});

// Zoom and Pan functionality
const zoom = d3.zoom()
  .scaleExtent([0.5, 5])
  .on("zoom", (event) => {
    svg.attr("transform", event.transform);
  });

svg.call(zoom);
