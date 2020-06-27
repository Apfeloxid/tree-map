const urlData = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";
const h = 600;
const w = 1200;
const paddingBetweenCategory = 1;
const paddingOutside = 10;

console.log("hey");

window.onload = function() {

    const svg = d3.select("#svg-container")
        .append("svg")
        .attr("height", h)
        .attr("width", w);

    const tooltip = d3.select("#tooltip");


    d3.json(urlData).then(function(data) {
        console.log(data);

        let root = d3.hierarchy(data).sum(function(d) {return d.value});

        d3.treemap()
            .size([w, h])
            .padding(paddingBetweenCategory)
            (root);

        svg.selectAll("rect")
            .data(root.leaves())
            .enter()
            .append("rect")
            .attr("class", "tile")
            .attr("data-name", d => d.data.name)
            .attr("data-category", d => d.data.category)
            .attr("data-value", d => d.data.value)
            .attr("x", d => d.x0)
            .attr("y", d => d.y0)
            .attr("width", d => d.x1 - d.x0)
            .attr("height", d => d.y1 - d.y0)
            .style("fill", "orange")
            .on("mousemove", (d, i) => {
                tooltip.html(`Name: ${d.data.name}<br>Category: ${d.data.category}<br>Value: ${d.data.value}`)
                    .attr("data-value", d.data.value)
                    .style("opacity", 0.75)
                    .style("left", d3.event.pageX + "px")
                    .style("top", d3.event.pageY + "px")
            })
            .on("mouseout", () => {
                tooltip.style("opacity", 0);
            });

        svg.selectAll("text")
            .data(root.leaves())
            .enter()
            .append("text")
            .attr("class", "tile-text")
            .attr("x", d => d.x0 + 5)
            .attr("y", d => d.y0 + 9)
            .text(d => d.data.name);

    });
}