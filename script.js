/* Constants for use in D3 */

const WIDTH = 1000;
const HEIGHT = 1000;
const PADDING = {top: 50, right: 0, bottom: 0, left: 0}
const PADDING_OUTER = 3;
const PADDING_INNER = 3;

const tooltipWidth = 140;
const tooltipHeight = 55;
let tooltipDiv;

//This call populates the page with the Video Games Dataset treemap on page load.
//This is inside window.onload to give access to the DOM inside the function.
window.onload = () => {
    buildTreemap("https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json");
    tooltipDiv = d3.select("body").append("div").attr("id", "tooltip").style("opacity", 0);

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
        let color = d3.scaleOrdinal(d3.schemePaired);
        let root = d3.hierarchy(json);
        root.sum((d) => d.value);
        treemapLayout(root);
        console.log(root.descendants());
    
        let title = d3.select("#content").append("h1").text(root.descendants()[0]["data"]["name"]);

        const svg = d3.select("#content").append("svg").attr("width", WIDTH).attr("height", HEIGHT).attr("id", "TEST").append("g");

        let nodes = d3.select("svg g")
            .selectAll("g")
            .data(root.leaves())
            .enter()
            .append("g")
            .attr("transform", (d) => "translate(" + [d.x0, d.y0] + ")");
    
            nodes.append("rect")
            .attr("width", (d) => d.x1-d.x0)
            .attr("height", (d) => d.y1-d.y0)
            .attr("fill", (d) => color(d.data.category))
            .style("opacity", 1)
            .on("mouseover", (d) => {
                let data = d.data;
                tooltipDiv.transition().duration(100).style("opacity", 1);
                tooltipDiv.html(generateTooltip(data))
                // .attr(/*data attributes*/)
                   .style("left", (d3.event.pageX)+"px")
                   .style("top", (d3.event.pageY-tooltipHeight)+"px");
            })
            .on("mouseout", () => {
                tooltipDiv.transition().duration(500).style("opacity", 0);
            });
    
            nodes.append("text")
            .attr("dx", 4)
            .attr("dy", 14)
            // .attr("textLength", (d) => ((d.x1-d.x0) - 10))
            .text((d) => d.data.name);
        
    });
    
}

function generateTooltip(data) {
    let html = `<p>
            Name: ${data.name}<br/>
            Category: ${data.category}<br/>
            Value: ${data.value}
            </p>`;
    return html;
    
}