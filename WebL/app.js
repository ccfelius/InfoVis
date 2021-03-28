document.addEventListener('DOMContentLoaded', function(e) {     
	d3.json("data/batch1.json", function (data) {
        var height = window.innerHeight,
            width = window.innerWidth,
            radius = 5;

        var svg = d3.select("#network")
          .append("svg")
          .attr("height", height)
          .attr("width", width)
          .call(d3.zoom()
            .on("zoom", function () {
            svg.attr("transform", d3.event.transform)
          }))
          .append("g")

        svg.append("rect")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill", "#4e5965")
                    // .attr("fill", "#4e5965")

        svg.append("text").text('REDDIT DATASET')
          .attr("x", (100))
          .attr("y",(85))
          .attr("opacity", 0.7)
          .attr("font-family", "Titillium Web")
          .attr("letter-spacing", "0.5em")
          .attr("font-style", "normal")
          .attr("text-anchor", "middle")
          .style("font-size", "40px")
          .style("fill", "white")

        const simulation = d3
            .forceSimulation()
            .nodes(data.nodes)
            .force("charge_force", d3.forceManyBody()
                .strength(-50))
            .force("center_force", d3.forceCenter(width / 2, height / 2))
      		.force('collide', d3.forceCollide()
                .radius(20)
                .iterations(1)
                // .on("tickActions", tickActions)
          );

        const drag = d3
            .drag()
            .on("start", dragstart)
            .on("drag", dragged);

        var maxNodeValue = d3.max(returnNodeValues(data));
        var minNodeValue = d3.min(returnNodeValues(data));

        function returnNodeValues(data) {
          var array = [];
          for (var i = 0; i < data.nodes.length; i++) {
            // console.log(data.nodes[i].value)
            // console.log(data.nodes[i].value)
            array.push(data.nodes[i].value);
          // console.log(array)
          }
          return array;
        }


        //draw circles for the nodes
        var node = svg.append("g")
          .attr("class", "nodes")
          .selectAll("circle")
          .data(data.nodes)
          .enter()
          .append("circle")
            .attr("opacity", function(d) {
              result = (d.value/minNodeValue) / (maxNodeValue / minNodeValue)
              return result + 0.2
            })
            .attr("fill", "white")
            .attr('r', function(d) {
              return d.value / 200 +2
            })
            .call(drag).on("click", click);


        var label = svg.append("g")
          .attr("class", "labels")
          .attr("font-family", "Titillium Web")

          .attr("fill", "white")
          .attr("font-size", "15px")

          .selectAll("text")
          .data(data.nodes)
          .enter().append("text")
            .attr("dy", function(d) {
              return -(d.value / 200 +9)
            })
            .attr("text-anchor", "middle")
            .attr("letter-spacing", "0.25em")
            .attr("opacity", "0")
            .attr("class", "label")
            .text("TEST");

        console.log(node);

        simulation.on("tick", tickActions );

        var link_force =  d3.forceLink(data.links)
          .id(function(d) { return d.id; })
          .distance(200)

        simulation.force("links", link_force)

        var link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(data.links)
            .enter().append("line")
            .attr('stroke-width', function(d) {
              return d.value / 100;
            })



        function tickActions() {
            //update circle positions each tick of the simulation
            node
                .attr("cx", function (d) {
                    return d.x = Math.max(radius, Math.min(width - radius, d.x));
                })
                .attr("cy", function (d) {
                    return d.y = Math.max(radius, Math.min(height - radius, d.y));
                });
            link
                .attr("x1", function (d) {
                    return d.source.x;
                })
                .attr("y1", function (d) {
                    return d.source.y;
                })
                .attr("x2", function (d) {
                    return d.target.x;
                })
                .attr("y2", function (d) {
                    return d.target.y;
                });
            label
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
            // .style("font-size", "10px").style("fill", "#333");
        }

        function click(event, d) {
            delete d.fx;
            delete d.fy;
            d3.select(this).classed("fixed", false);
            simulation.alpha(1).restart();
        }

        function dragstart() {
            d3.select(this).classed("fixed", true);
        }

        function clamp(num, min, max) {
            return num <= min ? min : num >= max ? max : num;
        }

        function dragged(event, d) {
            d.fx = clamp(event.x, 0, width);
            d.fy = clamp(event.y, 0, height);
            simulation.alpha(1).restart();
        }

    })
    });