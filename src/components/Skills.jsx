import React from 'react';
import * as d3 from "d3";

import skills from './../data/skills.csv';


export default class Skills extends React.Component {

    componentDidMount() {
      let width = window.innerWidth, height = window.innerHeight, sizeDivisor = 100, nodePadding = 10;

      let svg = d3.select(".skills").append("svg")
        .attr("width", width)
        .attr("height", height);

      let color = d3.scaleOrdinal(["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3",
        "#a6d854", "#ffd92f", "#e5c494", "#b3b3b3"]);

      let simulation = d3.forceSimulation()
        .force("forceX", d3.forceX().strength(.1).x(width * .5))
        .force("forceY", d3.forceY().strength(.1).y(height * .5))
        .force("center", d3.forceCenter().x(width * .5).y(height * .5))
        .force("charge", d3.forceManyBody().strength(-15));

      let node = svg.append("g")
          .attr("class", "node")
        .selectAll("circle")
        .data(skills)
        .enter().append("circle")
          .attr("r", (d) => { return d.level; })
          .attr("fill", (d) => { return color(d.type); })
          .attr("text", function(d) { return color(d.skill); })
          .attr("cx", (d) => { return d.x; })
          .attr("cy", (d) => { return d.y; })
          .call(d3.drag()
              .on("start", (d) => {
                if (!d3.event.active) simulation.alphaTarget(.03).restart();
                d.fx = d.x;
                d.fy = d.y;
              })
              .on("drag", (d) => {
                d.fx = d3.event.x;
                d.fy = d3.event.y;
              })
              .on("end", (d) => {
                if (!d3.event.active) simulation.alphaTarget(.03);
                d.fx = null;
                d.fy = null;
              }));

      simulation
          .nodes(skills)
          .force(
            "collide",
            d3.forceCollide().strength(.5).radius((d) => {
              return d.level + nodePadding;
            }).iterations(1)
          )
          .on("tick", (d) => {
            node
              .attr("cx", (d) => { return d.x; })
              .attr("cy", (d) => { return d.y; })
          });

    }

    render() {
      return (
        <div className="skills"></div>
      )
    }

}
