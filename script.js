const width = window.innerWidth;
const height = window.innerHeight;

const svg = d3.select('#network')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

const nodes = [
  { id: "Andrew Trousdale", group: 1, type: "circle", fixed: true },
  { id: "Interactive Machines", group: 2, type: "hexagon" },
  { id: "Human Expression", group: 2, type: "square" },
  { id: "Positive Psychology", group: 2, type: "triangle" },
  { id: "Evolutionary Systems", group: 2, type: "triangle" },
  { id: "Information", group: 2, type: "circle" }
];

const links = [
  { source: "Andrew Trousdale", target: "Interactive Machines" },
  { source: "Andrew Trousdale", target: "Human Expression" },
  { source: "Andrew Trousdale", target: "Positive Psychology" },
  { source: "Andrew Trousdale", target: "Evolutionary Systems" },
  { source: "Andrew Trousdale", target: "Information" }
];

const simulation = d3.forceSimulation(nodes)
  .force("link", d3.forceLink(links).id(d => d.id).distance(150))
  .force("charge", d3.forceManyBody().strength(-100))
  .force("center", d3.forceCenter(width / 2, height / 2))
  .force("collide", d3.forceCollide().radius(40))
  .on("tick", ticked);

const link = svg.append("g")
  .attr("class", "links")
  .selectAll("line")
  .data(links)
  .enter().append("line")
  .attr("stroke-width", 1)
  .attr("stroke", "#333");

const node = svg.append("g")
  .attr("class", "nodes")
  .selectAll("g")
  .data(nodes)
  .enter().append("g")
  .on("click", handleNodeClick);

node.each(function(d) {
  if (d.type === "circle") {
    d3.select(this).append("circle")
      .attr("r", 11)
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

node.append("text")
  .text(d => d.id)
  .attr("x", 25)
  .attr("y", 5)
  .attr("font-size", "14px")
  .attr("font-family", "Arial");

simulation.on('tick', () => {
  nodes.forEach(d => {
    if (d.id === 'Andrew Trousdale') {
      d.fx = width / 2;
      d.fy = height / 2;
    }
  });
  ticked();
});

setInterval(() => {
  nodes.forEach(d => {
    if (d.id !== 'Andrew Trousdale') {
      d.x += Math.random() * 1 - 0.5;
      d.y += Math.random() * 1 - 0.5;
      d.x = Math.max(30, Math.min(width - 30, d.x));
      d.y = Math.max(30, Math.min(height - 30, d.y));
    }
  });
  simulation.alpha(0.1).restart();
}, 300);

function ticked() {
  link
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y);

  node
    .attr("transform", d => `translate(${d.x},${d.y})`);
}

function createHexagonPath(radius) {
  const angle = Math.PI / 3;
  let path = "";
  for (let i = 0; i < 6; i++) {
    const x = radius * Math.cos(i * angle);
    const y = radius * Math.sin(i * angle);
    path += `${i === 0 ? "M" : "L"}${x},${y}`;
  }
  return path + "Z";
}

function createEquilateralTrianglePath(size) {
  const height = (Math.sqrt(3) / 2) * size;
  return `M0,-${height / 2} L${size / 2},${height / 2} L-${size / 2},${height / 2} Z`;
}

function handleNodeClick(event, d) {
  const modal = document.getElementById("myModal");
  const modalTitle = document.getElementById("modalTitle");
  modalTitle.textContent = d.id;
  modal.style.display = "block";
}

document.querySelector(".close").addEventListener("click", function() {
  document.getElementById("myModal").style.display = "none";
});
