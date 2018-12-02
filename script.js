const WIDTH = 800;
const HEIGHT = 800;
const PADDING_OUTER = 10;

window.fetch("https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json")
.then((response) => {
    return response.json();
})
.then((VGjson) => {
    let treemapLayout = d3.treemap().size([WIDTH, HEIGHT]).paddingOuter(PADDING_OUTER);
    let VGJsonRoot = d3.hierarchy(VGjson);
    VGJsonRoot.sum((d) => d.value);
    treemapLayout(VGJsonRoot);
    console.log(VGJsonRoot.descendants());

    const svg = d3.select("body").append("svg").attr("width", WIDTH).attr("height", HEIGHT).attr("id", "TEST");

    // d3.select("svg").append("rect").attr("x", 10).attr("y", 10).attr("width", 50).attr("height", 100);

    d3.select("svg")
    .selectAll("rect")
    .data(VGJsonRoot.descendants())
    .enter()
    .append("rect")
    .attr("fill", "green")
    .attr("x", (d) => d.x0)
    .attr("y", (d) => d.y0)
    .attr("width", (d) => d.x1-d.x0)
    .attr("height", (d) => d.y1-d.y0)
    .style("opacity", .5);

});