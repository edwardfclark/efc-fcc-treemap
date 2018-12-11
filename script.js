/* Constants for use in D3 */

const WIDTH = 1300;
const HEIGHT = 550;
const LEGEND_WIDTH = 500;
const LEGEND_HEIGHT = 400;
const PADDING = {top: 50, right: 0, bottom: 30, left: 0}
const PADDING_OUTER = 0;
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
    // document.getElementById("legend").innerHTML = "";

    //fetch().then() to create a promise and resolve the code this way.
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
        console.log(root.leaves());
    
        let name = root.descendants()[0]["data"]["name"];
        let title = d3.select("#content").append("h1").attr("id", "title").text(name);
        let description = d3.select("#content").append("h3").attr("id", "description").text(`Top 100 ${name == "Kickstarter" ? "Most Pledged" : ""} ${name == "Kickstarter" ? "Kickstarter Campaigns" : name == "Movies" ? "Highest Grossing Movies" : "Video Games Sold"} Grouped By ${name == "Kickstarter" ? "Category" : name == "Movies" ? "Genre" : "Platform"}`);
        const svg = d3.select("#content").append("svg").attr("width", WIDTH).attr("height", HEIGHT+LEGEND_HEIGHT).attr("id", "TEST").append("g");

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
            .attr("class", "tile")
            .attr("data-name", (d) => d.data.name)
            .attr("data-category", (d) => d.data.category)
            .attr("data-value", (d) => d.data.value)
            .on("mouseover", (d) => {
                let data = d.data;
                tooltipDiv.transition().duration(100).style("opacity", 1);
                tooltipDiv.html(generateTooltip(data))
                .attr("data-value", data.value)
                   .style("left", (d3.event.pageX)+"px")
                   .style("top", (d3.event.pageY-tooltipHeight)+"px");
            })
            .on("mouseout", () => {
                tooltipDiv.transition().duration(500).style("opacity", 0);
            });
    
            //Add a text element to each node.
            let text = nodes.append("text")
            .attr("dx", 4)
            .attr("dy", 14);

            //Add a tspan element to each text node for each word in the name.
            text.selectAll("tspan")
            .data(d => d.data.name.split(" "))
            .enter()
            .append("tspan")
            .text(d => d)
            .attr("x", 0)
            .attr("dx", 5)
            .attr("dy", 12);

            let categories = [];

            for (i=0;i<root.leaves().length;i++) {
                if (categories.indexOf(root.leaves()[i]["data"]["category"]) == -1) {
                    categories.push(root.leaves()[i]["data"]["category"]);
                }
            }


            let legend = d3.select("svg").append("g").attr("id", "legend");

            let legendRects = legend.selectAll("rect")
            .data(categories)
            .enter()
            .append("rect")
            .attr("class", "legend-item")
            .attr("width", 25)
            .attr("height", 25)
            .attr("fill", (d) => color(d))
            .attr("y", HEIGHT+PADDING.bottom)
            .attr("x", (d,i) => i*50);

            let legendText = legend.selectAll("text")
            .data(categories)
            .enter()
            .append("text")
            .attr("y", HEIGHT+PADDING.bottom+55)
            .attr("x", (d,i) => i*50)
            .text((d) => d);
           
        
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
