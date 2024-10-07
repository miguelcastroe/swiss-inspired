// Set the dimensions for the SVG container
const width = window.innerWidth;
const height = window.innerHeight;

const svg = d3.select('svg')
  .attr('width', width)
  .attr('height', height);

// Data for the nodes
const nodesData = [
  { id: 'Andrew Trousdale', shape: 'circle' },
  { id: 'Positive Psychology', shape: 'triangle' },
  { id: 'Interactive Machines', shape: 'hexagon' },
  { id: 'Human Expression', shape: 'square' },
  { id: 'Evolutionary Systems', shape: 'triangle' },
  { id: 'Information', shape: 'circle' }
];

// Initialize force simulation
const simulation = d3.forceSimulation(nodesData)
  .force('link', d3.forceLink().distance(150))
  .force('charge', d3.forceManyBody().strength(-300))
  .force('center', d3.forceCenter(width / 2, height / 2))
  .on('tick', ticked);

// Draw the nodes
const nodes = svg.selectAll('path.node')
  .data(nodesData)
  .enter().append('g')
  .attr('class', 'node')
  .call(drag(simulation));

// Append the correct shapes
nodes.append('path')
  .attr('d', d => generateShape(d.shape))
  .attr('transform', 'scale(1)')
  .attr('fill', '#ddd')
  .attr('stroke', '#333')
  .attr('stroke-width', '2');

// Append labels
nodes.append('text')
  .attr('x', 12)
  .attr('y', 4)
  .text(d => d.id)
  .attr('font-size', '12px');

// Make nodes clickable to show modal
nodes.on('click', function(event, d) {
  showModal(d.id);
});

// Force simulation tick event
function ticked() {
  nodes.attr('transform', d => `translate(${d.x},${d.y})`);
}

// Modal handling functions
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const closeBtn = document.querySelector('.close-btn');

function showModal(nodeName) {
  modal.style.display = 'block';
  modalTitle.textContent = nodeName;
}

closeBtn.onclick = function() {
  modal.style.display = 'none';
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
}

// Shape generation function
function generateShape(shapeType) {
  switch (shapeType) {
    case 'circle':
      return d3.symbol().type(d3.symbolCircle).size(1540)();
    case 'hexagon':
      return drawHexagon();
    case 'square':
      return drawSquare();
    case 'triangle':
      return drawTriangle();
    default:
      return d3.symbol().type(d3.symbolCircle).size(1540)();
  }
}

// Custom shape functions
function drawHexagon() {
  const size = 22;
  const points = 6;
  const radius = size / 2;
  let angle = Math.PI / 3;

  const path = d3.path();
  for (let i = 0; i < points; i++) {
    const x = radius * Math.cos(angle * i);
    const y = radius * Math.sin(angle * i);
    if (i === 0) path.moveTo(x, y);
    else path.lineTo(x, y);
  }
  path.closePath();
  return path.toString();
}

function drawSquare() {
  const size = 22;
  const path = d3.path();
  path.rect(-size / 2, -size / 2, size, size);
  return path.toString();
}

function drawTriangle() {
  const size = 22;
  const path = d3.path();
  path.moveTo(0, -size / Math.sqrt(3));
  path.lineTo(-size / 2, size / (2 * Math.sqrt(3)));
  path.lineTo(size / 2, size / (2 * Math.sqrt(3)));
  path.closePath();
  return path.toString();
}

// Drag handling functions
function drag(simulation) {
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  return d3.drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended);
}
