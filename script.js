const width = window.innerWidth;
const height = window.innerHeight;

const svg = d3.select("#network-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const nodes = [
    { id: "Andrew Trousdale", group: 1, shape: "circle", fixed: true },
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

const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(150))
    .force("charge", d3.forceManyBody().strength(-100))
    .force("collision", d3.forceCollide().radius(40))
    .alphaDecay(0.01)
    .velocityDecay(0.4);

const link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links)
    .enter().append("line");

const node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("g")
    .data(nodes)
    .enter().append("g");

node.each(function (d) {
    if (d.shape === "circle") {
        d3.select(this).append("circle")
            .attr("r", 11)  // Diameter 22px
            .attr("class", "shape circle");
    } else if (d.shape === "hexagon") {
        const size = 11;  // Radius, makes the hexagon approximately 22px
        d3.select(this).append("polygon")
            .attr("points", hexagonPoints(size))
            .attr("class", "shape hexagon");
    } else if (d.shape === "square") {
        d3.select(this).append("rect")
            .attr("width", 22)
            .attr("height", 22)
            .attr("x", -11)  // Centering
            .attr("y", -11)
            .attr("class", "shape square");
    } else if (d.shape === "triangle") {
        const size = 12.7;  // Adjust for the equilateral triangle to have height ~22px
        d3.select(this).append("polygon")
            .attr("points", trianglePoints(size))
            .attr("class", "shape triangle");
    }
});

function hexagonPoints(size) {
    const angle = Math.PI / 3;
    return Array.from({ length: 6 }, (_, i) => [
        size * Math.cos(angle * i),
        size * Math.sin(angle * i)
    ]).map(p => p.join(",")).join(" ");
}

function trianglePoints(size) {
    const height = size * Math.sqrt(3);
    return `0,${-height / 2} ${-size},${height / 2} ${size},${height / 2}`;
}

node.append("text")
    .attr("class", "label")
    .attr("x", 25)
    .attr("y", 5)
    .text(d => d.id);

simulation.on("tick", () => {
    const centerNode = nodes.find(d => d.id === "Andrew Trousdale");
    centerNode.fx = width / 2;
    centerNode.fy = height / 2;

    link.attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node.attr("transform", d => `translate(${d.x},${d.y})`);
});

function floatEffect() {
    nodes.forEach(d => {
        if (!d.fixed) {
            d.vx += (Math.random() - 0.5) * 0.01;
            d.vy += (Math.random() - 0.5) * 0.01;
        }
    });

    simulation.alpha(0.1).restart();
}

d3.interval(() => {
    floatEffect();
}, 3000);

const zoom = d3.zoom()
    .scaleExtent([0.5, 5])
    .on("zoom", (event) => {
        svg.attr("transform", event.transform);
    });

svg.call(zoom);
