const urlData = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";
const h = 650;
const w = 1400;
const paddingBetweenCategory = 1;
const paddingOutside = 10;

window.onload = function() {

    const svg = d3.select("#svg-container")
        .append("svg")
        .attr("height", h)
        .attr("width", w);

    const legend = d3.select("#svg-container")
        .append("svg")
        .attr("id", "legend")
        .attr("height", h)
        .attr("width", 80);

    const tooltip = d3.select("#tooltip");
    

    d3.json(urlData).then(function(data) {
        console.log(data);

        let categories = data.children.map(child => child.name);

        let colors = [];
        for (let i = 0; i < categories.length; i++) {
            colors.push(d3.interpolateRainbow(i / categories.length))
        }
        colors = shuffle(colors);

        console.log(colors);
        console.log(categories);


        let colorScale = d3.scaleOrdinal()
                .domain(categories)
                .range(colors);

        let root = d3.hierarchy(data).sum(function(d) {return d.value}).sort(function(a, b) { return b.height - a.height || b.value - a.value; });



        d3.treemap()
            .size([w, h])
            .padding(paddingBetweenCategory)
            (root);

        let containers = svg.selectAll("svg")
            .data(root.leaves())
            .enter()
            .append("g")
            .attr("x", d => d.x0)
            .attr("y", d => d.y0)
            .attr("width", d => d.x1 - d.x0)
            .attr("height", d => d.y1 - d.y0)



        containers.append("rect")
            .attr("class", "tile")
            .attr("data-name", d => d.data.name)
            .attr("data-category", d => d.data.category)
            .attr("data-value", d => d.data.value)
            .attr("x", d => d.x0)
            .attr("y", d => d.y0)
            .attr("width", d => d.x1 - d.x0)
            .attr("height", d => d.y1 - d.y0)
            .style("fill", d => colorScale(d.data.category))
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

        containers.append("text")
            .attr("class", "tile-text")
            .selectAll("tspan")
            .data((d, i) => d.data.name.split(/[\s/](?=[(a-zA-Z])(?!of)(?!Duty)(?!in)(?!a\s)(?!U\s)/g).map(word => { return {text: word, 
                                                                                width: d.x0 + (d.x1 - d.x0) / 2,
                                                                                height: d.y0 + 10}}))
            .enter()
            .append("tspan")
            .attr("x", d => d.width)
            .attr("y", (d, i) => d.height + 10 * i)
            .attr("dominant-baseline", "middle")
            .attr("text-anchor", "middle")
            .attr("inline-size", "180")
            .text(d => d.text);


        legend.selectAll("rect")
            .data(categories)
            .enter()
            .append("rect")
            .attr("class", "legend-item")
            .attr("height", 20)
            .attr("width", 20)
            .attr("y", (d, i) => 30 + 33 * i)
            .attr("x", 30)
            .style("fill", d => colorScale(d))

        legend.selectAll("text")
            .data(categories)
            .enter()
            .append("text")
            .attr("x", 55)
            .attr("y", (d, i) => 43 + 33 * i)
            .text(d => d)
            .style("font-size", "10px");

    });
}


function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}