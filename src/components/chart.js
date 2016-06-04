import React from 'react';
import d3 from 'd3';

const Chart = (props) => {

  Chart.destroy= ()=>{
    d3.select('#chart').remove();
  };
  Chart.remake = () => {
    d3.select('.chartDiv').append('div').attr('id', 'chart');
  };

	const Data = props.data;

  const width = 400,
      height = 400,
      radius = Math.min(width, height) / 2;

  let color = d3.scale.category20();

  let chart = d3.select("#chart")
    .append('svg')
    .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  Chart.colors = [];

  let info = d3.select('#chart').append('div').attr('class', 'info').style('opacity', 0)

  let arc = d3.svg.arc()
    .outerRadius(radius - 50)
    .innerRadius(radius - 120);

  let pie = d3.layout.pie()
    .sort(null)
    .startAngle(1.1*Math.PI)
    .endAngle(3.1*Math.PI)
    .value( d=> d.votes );


  let g = chart.selectAll(".arc")
  .data(pie(Data))
  .enter().append("g")
  .attr("class", "arc");

  g.append("path")
    .attr("fill", (d) => { return color(d.data.name); })
    .on('mouseover', function(d){
      d3.select(this).transition().duration(500).style('fill', 'black');
      info.transition().duration(500).style('background-color', ()=>{ return color(d.data.name)}).style('opacity', 1);
      info.html("<span class='infoText'>"+d.data.name+"</span><br /><span class='infoText'>"+d.data.votes+' Votes')
        .style('left', (d3.select('svg').attr("cx")) + "px").style('top', (d3.select('svg').attr("cy")) + "px");
    })
    .on('mouseout', function(d){
      d3.select(this).transition().duration(250).style('background-color', '#ADADAD').style('fill', (d) => { return color(d.data.name); })
      info.transition().duration(250).style('opacity', 0);
    })
    .transition()
    .ease("linear")
    .duration(500)
    .attrTween("d", d=>{
      let i = d3.interpolate(d.startAngle+0.1, d.endAngle);
      return t=>{
        d.endAngle = i(t);
        return arc(d)
      }
    });

  let legend = d3.select('#chart').append('ul')
    .attr("class", "legend")
    .attr("x", width - 65)
    .attr("y", 25)
    .attr("height", 100)
    .attr("width", 100);

  legend.selectAll('g').data(Data)
    .enter()
    .append('li')
    .each(function(d, i){
      let div = d3.select(this);
      div.append('div')
        .attr('class', 'legendDiv')
        .attr("x", width - 65)
        .attr("y", i * 25 + 8)
        .style("width", '10px')
        .style("height", '10px')
        .style("background-color", (d)=>{return color(d.name)});

      div.append('text')
        .attr("x", width - 50)
        .attr("y", i * 25 + 8)
        .attr("height",30)
        .attr("width",100)
        .text((d)=>{return d.name + ' | '+ d.votes + ' votes'});
    })


  return <div id='chart' />

}

export default Chart;