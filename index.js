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
		template: fs.readFileSync("./template.html", "utf8"),
		layout: fs.readFileSync("./layout.json", "utf8")
	},
	computed: {
		rendered: function() {
			var data = this.$data;
			try {
				var graph = data.graph;
				var template = data.template;
				var layout = data.layout;
				var rendered = render_graph(graph, template, layout);
			} catch (e) {
				console.error(e);
			}
			return rendered;
		}
	}
});

function render_graph(graph_source, template_source, layout_source) {
	var layout = JSON.parse(layout_source);
	var graph = dot.read(graph_source);
	graph.setGraph(layout.graph);
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
		offsetX: graph_width * -0.5,
		offsetY: graph_height * -0.5,
		width: graph_width * 2,
		height: graph_height * 2
	};

	return data;
}

function process_node(graph, n) {
	var node = graph.node(n);
	return node;
}

function process_edge(graph, e) {
	var edge = graph.edge(e);
	console.log("Edge", e, "points:", JSON.stringify(edge.points));
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
