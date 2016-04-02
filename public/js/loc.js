var Loc = function(repo, w, h) {
    console.log("loc called")
    this.repo = repo;
    this.h = h;

    //d3.select(selector).selectAll("svg").remove();
    //
    //this.svg = d3.select(selector).append("svg:svg")
    //    .attr('width', w)
    //    .attr('height', h);
    //
    //this.svg.append("svg:rect")
    //    .style("stroke", "#999")
    //    .style("fill", "#F5F5F5")
    //    .classed("flower", true)
    //    .attr('width', w)
    //    .attr('height', h);
    //
    //this.force = d3.layout.force()
    //    .on("tick", this.tick.bind(this))
    //    .charge(function(d) { return d._children ? -d.size / 100 : -40; })
    //    .linkDistance(function(d) { return d.target._children ? 80 : 25; })
    //    .size([h, w]);
};

Loc.prototype.getData = function(json) {
    if (json) this.json = json;

    this.json.fixed = true;
    //this.json.x = this.w / 2;
    //this.json.y = this.h / 2;

    var nodes = this.flatten(this.json);
    var counts = 0;
    var $locTable = $(".loc-table");
    //$locTable.append("<table>");
    var tableStr = "";
    for (var i = nodes.length-1; i >= 0; i--) {
        console.log(nodes[i].name, nodes[i].size)
        if(nodes[i].name === "root") {
            $(".upper-content").html("<div class='loc-declaration'>"+this.repo + " total lines of code: " + nodes[i].size + "</div>")
        }

        if (nodes[i].name.indexOf('.') === -1) {
            console.log("dir", nodes[i].name)
            $locTable.append("<tr class='table-dir'><td colspan='3'>" + nodes[i].name + "</td></tr>");
            //$locTable.append("<tr><td>" + nodes[i].name + "</td><td>" + nodes[i].size + "</td></tr>");
            counts += nodes[i].size;
        } else {
            console.log("dir", nodes[i].name)
            $locTable.append("<tr><td>" + nodes[i].name + "</td><td>" + nodes[i].size + "</td><td>" + nodes[i].language + "</td></tr>");

        }
    }
    //$locTable.append("</table>");
}

Loc.prototype.flatten = function(root) {
    var nodes = [], i = 0;

    function recurse(node) {
        if (node.children) {
            node.size = node.children.reduce(function(p, v) {
                return p + recurse(v);
            }, 0);
        }
        if (!node.id) node.id = ++i;
        nodes.push(node);
        return node.size;
    }

    root.size = recurse(root);
    return nodes;
};