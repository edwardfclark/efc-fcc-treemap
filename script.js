/* Constants for use in D3 */

const WIDTH = 1800;
const HEIGHT = 1800;
const PADDING = {top: 50, right: 0, bottom: 0, left: 0}
const PADDING_OUTER = 3;
const PADDING_INNER = 3;



console.log("starting the call...");

//This is inside window.onload to give access to the DOM inside the function.
window.onload = () => {
    buildTreemap("https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json");
}



//buildTreemap() sets the content of the treemap using the dataset provided by the URL.
function buildTreemap(url) {

    //Clear the inside of #content right before the fetch.
    document.getElementById("content").innerHTML = "";

    window.fetch(url)
    .then((response) => {
        return response.json();
    })
    .then((json) => {
        let treemapLayout = d3.treemap().size([WIDTH, HEIGHT]).paddingOuter(PADDING_OUTER).paddingInner(PADDING_INNER);
        let root = d3.hierarchy(json);
        root.sum((d) => d.value);
        treemapLayout(root);
        console.log(root.descendants());
    
        let title = d3.select("#content").append("h1").text(root.descendants()[0]["data"]["name"]);

        const svg = d3.select("#content").append("svg").attr("width", WIDTH).attr("height", HEIGHT).attr("id", "TEST").append("g");

        //This appends empty g tags, preventing the category headers from being selected and displayed by the code below.
        /*
        root.descendants()[0]["children"].forEach(() => {
            svg.append("g");
        });
        */

        let nodes = d3.select("svg g")
            .selectAll("g")
            .data(root.leaves())
            .enter()
            .append("g")
            .attr("transform", (d) => "translate(" + [d.x0, d.y0] + ")");
    
            nodes.append("rect")
            .attr("width", (d) => d.x1-d.x0)
            .attr("height", (d) => d.y1-d.y0)
            .attr("fill", "blue")
            .style("opacity", .3);
    
            nodes.append("text")
            .attr("dx", 4)
            .attr("dy", 14)
            .text((d) => d.data.name);
        
    });
    
}