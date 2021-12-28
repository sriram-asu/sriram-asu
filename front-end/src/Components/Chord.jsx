import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import embeddings from "./embeddings";

const Chord = (props) => {
    const svgRef = useRef();
    const [data, setData] = useState([]);


    useEffect(() => {
        if(props.task !== '' ){
            props.toggleLoading(true);
            fetch(`/chord/${props.task}`)
                .then(response => response.json())
                .then(result => {
                    props.toggleLoading(false);
                    setData(result);
                });
        }
    },[props.task]);

    useEffect(() => {
        if(data.length !== 0 ){
            const category_mapper = {};
            for ( let i = 0; i < embeddings.length; i ++ ) {
                if(props.taskNeighbours.map(d => Object.keys(d)[0]).includes(embeddings[i].id)){
                    category_mapper[embeddings[i].id] = embeddings[i].category;
                }
            }
            d3.select(svgRef.current).selectAll("*").remove();

            const index_task_id_map = {}
            const matrix = []
            let count = 0;
            for(const key in data){
                index_task_id_map[count] = key;
                count = count +1;
                matrix.push(data[key]);
            }

            const outerRadius = (svgRef.current.clientWidth/2) - 95;
            const innerRadius = outerRadius - 20;
            const color = d3.scaleSequential().domain([0,matrix.length])
                .interpolator(d3.interpolateInferno);
            const opacityDefault = 0.8;

            const chord = d3.chord()
                .padAngle(0.1);
            const arc = d3.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius);
            const ribbonPath = d3.ribbon()
                .radius(innerRadius);

            const svg = d3.select(svgRef.current)
                .append("g")
                .attr("transform", `translate(${svgRef.current.clientWidth/2},${svgRef.current.clientHeight/2})`)
                .datum(chord(matrix));

            const outerCircle = svg.selectAll("g.group")
                .data(function(chords) { return chords.groups; })
                .enter().append("g")
                .attr("class", "group")
                .on("mouseover", fade(.1))
                .on("mouseout", fade(opacityDefault))
                .on("click", mouseoverChord)
                .on("mouseout", mouseoutChord);

            outerCircle.append("path")
                .style("fill", function(d) { return color(d.index); })
                .attr("id", function(d, i) { return "group" + d.index; })
                .attr("d", arc);

            outerCircle.append("text")
                .attr("x", 6)
                .attr("dy", 15)
                .append("textPath")
                .attr("xlink:href", function(d) { return "#group" + d.index; })
                .text(function(chords, i){
                    return category_mapper[Object.keys(props.taskNeighbours[i])[0]].substring(0,15);
                })
                .style("fill", "white");

            svg.selectAll("path.chord")
                .data(function(chords) { return chords; })
                .enter().append("path")
                .attr("class", "chord")
                .style("fill", function(d) { return color(d.source.index); })
                .style("opacity", opacityDefault)
                .attr("d", ribbonPath);

            function fade(opacity) {
                return function(event,d) {
                    svg.selectAll("path.chord")
                        .filter(function(data) { return data.source.index !== d.index && data.target.index !== d.index; })
                        .transition()
                        .style("opacity", opacity);
                };
            }
            function mouseoverChord(event,d,i) {
                svg.selectAll("path.chord")
                    .transition()
                    .style("opacity", 0.1);

                d3.select(this)
                    .transition()
                    .style("opacity", 1);
            }

            function mouseoutChord(event,d,i) {
                svg.selectAll("path.chord")
                    .transition()
                    .style("opacity", opacityDefault);
            }


        }
    },[data]);

    return (
        <React.Fragment>
            <svg ref={svgRef} style={{ width: '100%', height: '95%'}}>
            </svg>
        </React.Fragment>
    );
}

export default Chord;