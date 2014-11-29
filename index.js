var fs = require("fs");
var dot = require("graphlib-dot");
var dagre = require("dagre");
var mustache = require("mustache");

var graph_content = fs.readFileSync("./graph.dot", "utf8");
var template_content = fs.readFileSync("./template.html", "utf8");

var graph = dot.read(graph_content);

var layout_options = {
	graph: {
		edgesep: 0
	},
	node: {
		width: 10,
		height: 10
	}
}

dagre.layout(graph);

console.log("Graph:", graph);

var nodes = graph.nodes().map(process_node);

var edges = graph.edges().map(process_edge);

var graph_width = graph._label.width;
var graph_height = graph._label.height;

var data = {
	nodes: nodes,
	edges: edges,
	offsetX: graph_width * -0.5,
	offsetY: graph_height * -0.5,
	width: graph_width * 2,
	height: graph_height * 2
};

console.log("Parsed graph data:", data);

var svg = mustache.render(template_content, data);

console.log("Created SVG image:", svg);

var main = document.querySelector("main");

main.innerHTML = svg;


function process_node(n) {
	var node = graph.node(n);
	return node;
}

function process_edge(e) {
	var edge = graph.edge(e);
	edge.points = edge.points.map(process_point);
	return edge;
}

function process_point(e) {
	return {
		x: e.x ? e.x : 0,
		y: e.y ? e.y : 0
	}
}
