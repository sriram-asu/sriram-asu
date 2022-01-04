import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import embeddings from "./embeddings";
import CONSTANTS from "./constants";

const BeeSwarm = (props) => {
    const svgRef = useRef();
    const [data, setData] = useState([]);

    useEffect(() => {
        if(props.task !== ''){
            props.toggleLoading(true);
             fetch('/swarm_plot')
                .then(response => response.json())
                .then(result => {
                    props.toggleLoading(false);
                    setData(result);
                });
          
        }
    },[props.task]);
    useEffect(() => {

        const svg = d3.select(svgRef.current);
            let sectors = Array.from(new Set(data.map((d) => d.id)));
            let xCoords = sectors.map((d, i) => 75 + i * 110);
            let xScale = d3.scaleOrdinal().domain(sectors).range(xCoords);

            let yScale = d3
                .scaleLinear()
                .domain(d3.extent(data.map((d) => +d["accuracy"])))
                .range([svgRef.current.clientHeight-50 , 50]);

            let color = d3.scaleOrdinal().domain(sectors).range(d3.schemePaired);
            let Domain = d3.extent(data.map((d) => d["accuracy"]));
            Domain = Domain.map((d) => d);
            let size = d3.scaleLinear().domain(Domain).range([3, 15]);

  const xAxis = d3.axisBottom()
        .scale(xScale)
        .tickPadding(5);

    const xAxisG = svg.append('g')
        .style("font-size", `1rem`)
          .attr('transform', `translate(0, 400)`);
        svg
            .selectAll(".circ")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "circ")
            .attr("stroke", "black")
            .attr("fill", (d) => color(d.id))
            .attr("r", (d) => size(d["accuracy"]))
            .attr("cx", (d) => xScale(d.id))
            .attr("cy", (d) => yScale(d.accuracy))
            .on("mouseover", (event, d) => {
                let x = event.x,
                    y = event.y,
                    tooltip = document.getElementById('sphere-tooltip')
                tooltip.style.top = (y + 10) + 'px';
                tooltip.style.left = (x + 10) + 'px';
                tooltip.style.display = 'block';
                tooltip.style.position = 'absolute';
                tooltip.style.overflow = 'hidden';
                tooltip.style.padding = '10px';
                tooltip.style.background = `rgba(0, 0, 0, ${CONSTANTS.toolTipOpacity})`;
                tooltip.style.color = 'white';
                tooltip.style.maxWidth = '200px';
                tooltip.style.maxHeight = '100px';
                tooltip.style.border = '1px solid black';
                tooltip.innerText = d.accuracy.toFixed(3);
                d3.select(event.currentTarget).style("opacity", 0.8);
            })
            .on("mouseleave", (event) =>{
                document.getElementById('sphere-tooltip').style.display = 'none';
                d3.select(event.currentTarget).style("opacity", 1);
            });

       xAxisG.call(xAxis)
            let simulation = d3
                .forceSimulation(data)
                .force(
                    "x",
                    d3
                        .forceX((d) => {
                            return xScale(d.id);
                        })
                        .strength(0.2)
                )
                .force(
                    "y",
                    d3
                        .forceY(function (d) {
                            return yScale(d.accuracy);
                        })
                        .strength(1)
                )
                .force(
                    "collide",
                    d3.forceCollide((d) => {
                        return size(d["accuracy"]);
                    })
                )
                .alphaDecay(0)
                .alpha(0.3)
                .on("tick", tick);

            function tick() {
                d3.selectAll(".circ")
                    .attr("cx", (d) => {
                        return d.x;
                    })
                    .attr("cy", (d) => d.y);
            }

            let init_decay = setTimeout(function () {
                simulation.alphaDecay(0.1);
            }, 3000);
       
    },[data]);

    return (
        <React.Fragment>
            <svg ref={svgRef} style={{ width: '1200px', height: '95%'}}>
            </svg>
        </React.Fragment>
    );
}

export default BeeSwarm;