/*let width = 460,
    height = 300,
    radius = Math.min(width, height) / 2;

  let color = d3.scale.ordinal()
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    let arc = d3.svg.arc()
      .outerRadius(radius - 50)
      .innerRadius(radius - 105);

    let pie = d3.layout.pie()
      .sort(null)
      .startAngle(1.1*Math.PI)
      .endAngle(3.1*Math.PI)
      .value((d)=>{
        return d.votes
      });

    let svg = d3.select("#chart").append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    let g = svg.selectAll(".arc")
          .data(pie(Data))
          .enter().append("g")
          .attr("class", "arc");

    g.append("path")
          .attr("d", arc)
          .style("fill", d=>color(d.data.name) )
          .transition().delay(function(d, i) { return i * 500; }).duration(500)
          .attrTween('d', function(d) {
            var i = d3.interpolate(d.startAngle+0.1, d.endAngle);
            return function(t) {
              d.endAngle = i(t);
              return arc(d);
            }
          });*/


/*g.append("text")
          .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
          .attr("dy", ".35em")
          .text(function(d) { return d.data.name; });

          console.log(color('hello'));*/