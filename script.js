const width = window.innerWidth;
const height = window.innerHeight;

const svg = d3.select("#network-container")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Define the nodes and links
const nodes = [
  { id: "Andrew Trousdale", group: 1, shape: "circle" },
  { id: "Information", group: 1, shape: "circle" },
  { id: "Interactive Machines", group: 2, shape: "hexagon" },
  { id: "Human Expression", group: 2, shape: "square" },
  { id: "Evolutionary Systems", group: 3, shape: "circle" },
  { id: "Positive Psychology", group: 3, shape: "triangle" },
  // Add more nodes as needed
];

const links = [
  { source: "Andrew Trousdale", target: "Information", value: 1 },
  { source: "Andrew Trousdale", target: "Interactive Machines", value: 1 },
  { source: "Andrew Trousdale", target: "Human Expression", value: 1 },
  { source: "Human Expression", target: "Evolutionary Systems", value: 1 },
  { source: "Positive Psychology", target: "Andrew Trousdale", value: 1 },
  // Add more links as needed
];

// Set up the force simulation
const simulation = d3.forceSimulation(nodes)
  .force("link", d3.forceLink(links).id(d => d.id).distance(150))
  .force("charge", d3.forceManyBody().strength(-200))
  .force("center", d3.forceCenter(width / 2, height / 2));

const link = svg.append("g")
  .attr("class", "links")
  .selectAll("line")
  .data(links)
  .enter().append("line")
  .attr("class", d => d.dotted ? "dotted-line" : "line");

const node = svg.append("g")
  .attr("class", "nodes")
  .selectAll("g")
  .data(nodes)
  .enter().append("g");

node.append("text")
  .attr("class", "label")
  .attr("x", 8)
  .attr("y", 3)
  .text(d => d.id);

node.append("circle")
  .attr("r", 20)
  .attr("class", d => "shape " + d.shape);

simulation.on("tick", () => {
  link
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y);

  node
    .attr("transform", d => `translate(${d.x},${d.y})`);
});
