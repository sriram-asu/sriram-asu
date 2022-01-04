import React, { useState, useRef, useEffect } from 'react';
import { select, scaleBand, scaleLinear, axisBottom, axisLeft, scaleSequential, interpolateBuPu } from 'd3';
import * as d3 from 'd3';
import CONSTANTS from "./constants";

const BiasPanel = (props) => {
    const svgRef = useRef();
    const [data, setData] = useState([]);
    const [yMax, setYMax] = useState(0);
    const [boxPlotData, setBoxPlotData] = useState({});
    const [heatMapData, setHeatMapData] = useState([]);

    useEffect(() => {
        if(props.task !== '' && (props.biasSelectedOption === 't10' || props.biasRefresh)){
            props.toggleLoading(true);
            fetch(`/bias_${props.biasSelectedOption}/${props.task}`)
                .then(response => response.json())
                .then(result => {
                    const new_data = [];
                    let max_y_value = Number.NEGATIVE_INFINITY;
                    let min_y_value = Number.POSITIVE_INFINITY;
                    for (const key in result[0]['positive']) {

                        if(!key.includes("name")){
                            const item = {}
                            item['key'] = key;
                            item['value'] = result[0]['positive'][key];
                            item['instance_name'] = result[0]['positive'][key+"_name"];
                            max_y_value = Math.max(max_y_value, result[0]['positive'][key]);
                            min_y_value = Math.min(min_y_value, result[0]['positive'][key]);
                            new_data.push(item);
                        }

                    }
                    const new_data2 = [];
                    let max_y_value2 = Number.NEGATIVE_INFINITY;
                    let min_y_value2 = Number.POSITIVE_INFINITY;
                    for (const key in result[0]['negative']) {
                        if(!key.includes("name")){
                            const item = {}
                            item['key'] = key;
                            item['value'] = result[0]['negative'][key];
                            item['instance_name'] = result[0]['negative'][key+"_name"];
                            max_y_value2 = Math.max(max_y_value2, result[0]['negative'][key]);
                            min_y_value2 = Math.min(min_y_value2, result[0]['negative'][key]);
                            new_data2.push(item);
                        }
                    }
                    setBoxPlotData({'positive': new_data, 'positive_max' : max_y_value, 'positive_min': min_y_value,
                        'negative': new_data2, 'negative_max' : max_y_value2, 'negative_min': min_y_value2 })
                });
        }
        else if(props.task !== '' && ( props.biasSelectedOption === 't11'  || props.biasRefresh)){
            props.toggleLoading(true);
            fetch(`/heatmap/${props.task}`)
                .then(response => response.json())
                .then(function(data) {
                    setHeatMapData(data);
                });
        }
        else if(props.task !== '' && ( props.biasSelectedOption !== 't10'  || props.biasRefresh)){
            props.toggleLoading(true);
            fetch(`/bias_${props.biasSelectedOption}/${props.task}`)
                .then(response => response.json())
                .then(result => {
                    const new_data = [];
                    let count = 1;
                    let max_y_value = 0;
                    for (const key in result[0]) {
                        const item = {}
                        item['key'] = 'task_' + count;
                        item['task_id'] = key;
                        item['value'] = result[0][key];
                        count++;
                        max_y_value = Math.max(max_y_value, result[0][key]);
                        new_data.push(item);
                    }
                    setYMax(max_y_value);
                    setData(new_data);
                });
        }
        props.toggleRefresh(false);
    },[props.task, props.biasSelectedOption, props.biasRefresh]);
    useEffect(() => {
        if(data.length !== 0){
            const svg = select(svgRef.current);
            svg.selectAll("*").remove();
            const xScale = scaleBand().domain(data.map(d =>  d.key)).range([40,svgRef.current.clientWidth-50]).padding(0.25);
            const xAxis = axisBottom(xScale).ticks(data.length);
            svg.append("g")
                .style("transform", `translateY(${svgRef.current.clientHeight-20}px)`)
                .style("font-size", `1rem`)
                .call(xAxis);
            const yScale = scaleLinear()
                .domain([0, yMax])
                .range([svgRef.current.clientHeight-20, 20]);
            const yAxis = axisLeft(yScale).ticks(data.length);
            svg.append("g")
                .style("transform", `translateX(${40}px)`)
                .style("font-size", `1rem`)
                .call(yAxis);
            let colourScale = scaleSequential().domain([-yMax, yMax]).interpolator(interpolateBuPu);
            svg.selectAll(".bar")
                .data(data)
                .join("rect")
                .attr("class","bar")
                .style("transform", "scale(1,-1)")
                .attr("x",(d) => xScale(d.key))
                .attr("y",20-svgRef.current.clientHeight)
                .attr("width",xScale.bandwidth())
                .on("mouseover", (event,d)=>{
                    let x = event.x,
                        y = event.y,
                        tooltip = document.getElementById('sphere-tooltip')
                    tooltip.style.top = (y + 20) + 'px';
                    tooltip.style.left = (x + 20) + 'px';
                    tooltip.style.display = 'block';
                    tooltip.style.position = 'absolute';
                    tooltip.style.overflow = 'hidden';
                    tooltip.style.padding = '10px';
                    tooltip.style.background = `rgba(0, 0, 0, ${CONSTANTS.toolTipOpacity})`;
                    tooltip.style.color = 'white';
                    tooltip.style.maxWidth = '200px';
                    tooltip.style.maxHeight = '100px';
                    tooltip.style.border = '1px solid black';
                    tooltip.innerText = d.value.toFixed(3);
                    d3.select(event.currentTarget).style("opacity", 0.8);
                })
                .on("mouseout", (event, d)=>{
                    document.getElementById('sphere-tooltip').style.display = 'none';
                    d3.select(event.currentTarget).style("opacity", 1);
                })
                .transition()
                .attr("fill",(d) => colourScale(d.value))
                .style("stroke", (d,i) => {
                    if(d.task_id === props.task){
                        return "black";
                    }else{
                        return "none";
                    }
                })
                .style("stroke-width", "3")
                .attr("height",(d) => svgRef.current.clientHeight-20-yScale(d.value));
            props.toggleLoading(false);
        }
    },[data]);
    useEffect(() => {
        if(Object.keys(boxPlotData).length !== 0 && boxPlotData['positive'].length !== 0){
            const svg = select(svgRef.current);
            svg.selectAll("*").remove();
            const xScale = scaleBand().domain(['positive', 'negative']).range([55,svgRef.current.clientWidth-50]);
            const xAxis = axisBottom(xScale).ticks(2);
            svg.append("g")
                .style("transform", `translateY(${svgRef.current.clientHeight-25}px)`)
                .style("font-size", `1rem`)
                .call(xAxis);
            const yScaleMin = Math.min(boxPlotData['positive_min'],boxPlotData['negative_min'])
            const yScaleMax = Math.max(boxPlotData['positive_max'],boxPlotData['negative_max'])
            const yScale = scaleLinear()
                .domain([yScaleMin - (yScaleMax-yScaleMin)/10,yScaleMax + (yScaleMax-yScaleMin)/10])
                .range([svgRef.current.clientHeight-25, 20]);
            const yAxis = axisLeft(yScale);
            svg.append("g")
                .style("transform", `translateX(${55}px)`)
                .style("font-size", `1rem`)
                .call(yAxis);

            let data_unsorted = boxPlotData['positive'].map(d =>  ({ value : d.value, instance_name: d.instance_name }))
            let data_sorted = boxPlotData['positive'].map(d =>  d.value).sort(d3.ascending)
            let q1 = d3.quantile(data_sorted, .25)
            let median = d3.quantile(data_sorted, .5)
            let q3 = d3.quantile(data_sorted, .75)
            let min = boxPlotData['positive_min']
            let max = boxPlotData['positive_max']

            let positive_center = xScale('positive') + 211.25;
            var box_width = 100

            svg
                .append("line")
                .attr("x1", positive_center)
                .attr("x2", positive_center)
                .attr("y1", yScale(min) )
                .attr("y2", yScale(max) )
                .attr("stroke", "black")

            svg
                .append("rect")
                .attr("x", positive_center - box_width/2)
                .attr("y", yScale(q3) )
                .attr("height", (yScale(q1)-yScale(q3)) )
                .attr("width", box_width )
                .attr("stroke", "black")
                .style("fill", "#EACEF7")

            svg
                .selectAll("toto")
                .data([min, median, max])
                .enter()
                .append("line")
                .attr("x1", positive_center-box_width/2)
                .attr("x2", positive_center+box_width/2)
                .attr("y1", function(d){ return(yScale(d))} )
                .attr("y2", function(d){ return(yScale(d))} )
                .attr("stroke", "black")

            let colourScale = scaleSequential().domain([yScaleMin - (yScaleMax-yScaleMin)/10,yScaleMax + (yScaleMax-yScaleMin)/10]).interpolator(interpolateBuPu);

            let data_unsorted2 = boxPlotData['negative'].map(d =>  ({ value : d.value, instance_name: d.instance_name }))
            let data_sorted2 = boxPlotData['negative'].map(d =>  d.value).sort(d3.ascending)
            let q1_2 = d3.quantile(data_sorted2, .25)
            let median_2 = d3.quantile(data_sorted2, .5)
            let q3_2 = d3.quantile(data_sorted2, .75)
            let min_2 = boxPlotData['negative_min']
            let max_2 = boxPlotData['negative_max']

            let negative_center = xScale('negative') + 211.25;

            svg
                .append("line")
                .attr("x1", negative_center)
                .attr("x2", negative_center)
                .attr("y1", yScale(min_2) )
                .attr("y2", yScale(max_2) )
                .attr("stroke", "black")

            svg
                .append("rect")
                .attr("x", negative_center - box_width/2)
                .attr("y", yScale(q3_2) )
                .attr("height", (yScale(q1_2)-yScale(q3_2)) )
                .attr("width", box_width )
                .attr("stroke", "black")
                .style("fill", "#EACEF7")

            svg
                .selectAll("toto")
                .data([min_2, median_2, max_2])
                .enter()
                .append("line")
                .attr("x1", negative_center-box_width/2)
                .attr("x2", negative_center+box_width/2)
                .attr("y1", function(d){ return(yScale(d))} )
                .attr("y2", function(d){ return(yScale(d))} )
                .attr("stroke", "black")

            let circles = [];
            for (const data in data_unsorted){
                circles.push({'value': data_unsorted[data].value, instance_name: data_unsorted[data].instance_name , center: positive_center})
            }
            for (const data in data_unsorted2){
                circles.push({'value': data_unsorted2[data].value, instance_name: data_unsorted2[data].instance_name , center: negative_center})
            }
            svg.selectAll("circle")
                .data(circles)
                .enter().append("circle")
                .style("stroke", (d,i) => {
                    if(circles.length === 42 && i === 20){
                        return "black";
                    }else if (circles.length === 42 && i === 41){
                        return "black";
                    }else {
                        return "gray";
                    }
                })
                .style("stroke-width", (d,i) => {
                    if(circles.length === 42 && i === 20){
                        return "3";
                    }else if (circles.length === 42 && i === 41){
                        return "3";
                    }else {
                        return "1";
                    }
                })
                .style("fill", (d) => colourScale(d.value))
                .attr("r", 5)
                .attr("cx", (d) => d.center)
                .attr("cy", (d) => yScale(d.value))
                .on("mouseover", (event, d) => {
                    let x = event.x,
                        y = event.y,
                        tooltip = document.getElementById('sphere-tooltip')
                    tooltip.style.top = (y + 20) + 'px';
                    tooltip.style.left = (x + 20) + 'px';
                    tooltip.style.display = 'block';
                    tooltip.style.position = 'absolute';
                    tooltip.style.overflow = 'hidden';
                    tooltip.style.padding = '10px';
                    tooltip.style.background = `rgba(0, 0, 0, ${CONSTANTS.toolTipOpacity})`;
                    tooltip.style.color = 'white';
                    tooltip.style.maxWidth = '200px';
                    tooltip.style.maxHeight = '100px';
                    tooltip.style.border = '1px solid black';
                    tooltip.innerText = d.value.toFixed(3) + " , "+d.instance_name;
                    d3.select(event.currentTarget).style("opacity", 0.8);
                })
                .on("mouseleave", (event) =>{
                    document.getElementById('sphere-tooltip').style.display = 'none';
                    d3.select(event.currentTarget).style("opacity", 1);
                });
            props.toggleLoading(false);
        }
    },[boxPlotData]);
    useEffect(() => {
        if(heatMapData.length !== 0){
            const svg = select(svgRef.current);
            svg.selectAll("*").remove();

            const xScale = scaleBand().domain(heatMapData.map(d =>  d.group)).range([75,svgRef.current.clientWidth-50]).padding(0.05);
            const xAxis = axisBottom(xScale).ticks(data.length);
            svg.append("g")
                .style("transform", `translateY(${svgRef.current.clientHeight-20}px)`)
                .style("font-size", `1rem`)
                .call(xAxis);
            const yScale = scaleBand()
                .domain(heatMapData.map(d =>  d.variable))
                .range([svgRef.current.clientHeight-20, 20])
                .padding(0.05);
            const yAxis = axisLeft(yScale).ticks(data.length);
            svg.append("g")
                .style("transform", `translateX(${75}px)`)
                .style("font-size", `1rem`)
                .call(yAxis);

            var myColor = d3.scaleSequential()
                .interpolator(d3.interpolateInferno)
                .domain([1,100])

            svg.selectAll()
                .data(heatMapData)
                .enter()
                .append("rect")
                .attr("x", function(d) { return xScale(d.group) })
                .attr("y", function(d) { return yScale(d.variable) })
                .attr("rx", 4)
                .attr("ry", 4)
                .attr("width", xScale.bandwidth() )
                .attr("height", yScale.bandwidth() )
                .style("fill", function(d) { return myColor(d.value*100)} )
                .style("stroke-width", 4)
                .style("stroke", "none")
                .on("mouseover", (event, d) => {
                    let x = event.x,
                        y = event.y,
                        tooltip = document.getElementById('sphere-tooltip')
                    tooltip.style.top = (y + 20) + 'px';
                    tooltip.style.left = (x + 20) + 'px';
                    tooltip.style.display = 'block';
                    tooltip.style.position = 'absolute';
                    tooltip.style.overflow = 'hidden';
                    tooltip.style.padding = '10px';
                    tooltip.style.background = `rgba(0, 0, 0, ${CONSTANTS.toolTipOpacity})`;
                    tooltip.style.color = 'white';
                    tooltip.style.maxWidth = '200px';
                    tooltip.style.maxHeight = '100px';
                    tooltip.style.border = '1px solid black';
                    tooltip.innerText = parseFloat(d.value).toFixed(3);
                    d3.select(event.currentTarget).style("opacity", 0.8);
                })
                .on("mouseleave", (event) =>{
                    document.getElementById('sphere-tooltip').style.display = 'none';
                    d3.select(event.currentTarget).style("opacity", 1);
                })
            props.toggleLoading(false);
        }
    },[heatMapData]);
    return (
        <React.Fragment>
            <svg ref={svgRef} style={{ width: '100%', height: '95%'}}>
            </svg>
        </React.Fragment>
    );
}

export default BiasPanel;