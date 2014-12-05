var fs = require("fs");
var dot = require("graphlib-dot");
var dagre = require("dagre");
var mustache = require("mustache");
var Vue = require("vue");
var par = require("par");

var vm = new Vue({
	el: "body",
	data: {
		graph: fs.readFileSync("./graph.dot", "utf8"),
		template: fs.readFileSync("./template.html", "utf8")
	},
	computed: {
		rendered: function() {
			var data = this.$data;
			try {
				var graph = data.graph;
				var template = data.template;
				var rendered = render_graph(graph, template);
			} catch (e) {
				console.error(e);
			}
			return rendered;
		}
	},
	methods: {
		handle_tabs: handle_tabs
	}
});

function render_graph(graph_source, template_source) {
	var graph = dot.read(graph_source);
	dagre.layout(graph);
	var data = process_graph(graph);
	var rendered = mustache.render(template_source, data);
	return rendered;
}

function process_graph(graph) {
	console.log("Graph stats:", graph);
	var nodes = graph.nodes().map(par(process_node, graph));

	var edges = graph.edges().map(par(process_edge, graph));
	var graph_width = graph._label.width;
	var graph_height = graph._label.height;

	var data = {
		nodes: nodes,
		edges: edges,
		offsetX: 0,
		offsetY: 0,
		width: graph_width,
		height: graph_height
	};

	return data;
}

function process_node(graph, n) {
	var node = graph.node(n);
	node.label = n;
	node.rx = parseInt(node.width) / 2;
	node.ry = parseInt(node.height) / 2;
	console.log("Node", n, node);
	return node;
}

function process_edge(graph, e) {
	var edge = graph.edge(e);
	console.log("Edge", edge, "points:", JSON.stringify(edge.points));
	return {
		points: edge.points.map(process_point)
	}
}

function process_point(e) {
	return {
		x: e.x ? e.x : 0,
		y: e.y ? e.y : 0
	}
}

// Taken from http://jsfiddle.net/tovic/2wAzx/embedded/result,js/
function handle_tabs(e) {
	var el = e.target;
	if (e.keyCode === 9) { // tab was pressed
		// get caret position/selection
		var val = el.value,
			start = el.selectionStart,
			end = el.selectionEnd;
		// set textarea value to: text before caret + tab + text after caret
		el.value = val.substring(0, start) + '\t' + val.substring(end);
		// put caret at right position again
		el.selectionStart = el.selectionEnd = start + 1;
		// prevent the focus lose
		e.preventDefault();
		return false;
	}
}
