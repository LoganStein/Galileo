import React, { useContext, useEffect, useRef, useState } from "react";
// import { GetHistoricValue } from "../Helpers/GetHistoricValue";
import { GetHistoricValue } from "../Helpers/GetHistoricValueNew";
import * as d3 from "d3";
// import { TotalContext } from "./TotalContext";
import GetEffects from "../Helpers/GetEffects";

const tooltipStyle = {
  position: "absolute",
  visibility: "hidden",
  backgroundColor: "white",
  border: "solid",
  borderRadius: "5px",
  padding: "5px",
};

function Chart(props) {
  const data = props.data;
  console.log("chart data", data);
  const tooltipRef = useRef(null);

  const parentRef = useRef(null);

  const width = parentRef.current ? parentRef.current.offsetWidth : 0;
  const height = parentRef.current ? parentRef.current.offsetHeight : 0;

  const x = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.date))
    .range([props.margin.left, width - props.margin.right]);

  const y = d3
    .scaleLinear()
    .domain([
      d3.min(data, (d) => d.value) - d3.min(data, (d) => d.value) * 0.01,
      d3.max(data, (d) => d.value) + d3.max(data, (d) => d.value) * 0.01,
    ])
    .range([height - props.margin.top, props.margin.bottom]);

  const line = d3
    .line()
    .x((d, i) => x(d.date))
    .y((d) => y(d.value));

  const xAxis = d3.axisBottom(x).ticks(data.length);

  const yAxis = d3
    .axisLeft(y)
    .tickSize(5)
    .tickPadding(10)
    .tickFormat((d) => `$${d}`);

  return (
    <div ref={parentRef} style={{ width: props.width, height: props.height }}>
      <svg width="100%" height={props.height}>
        <path fill="none" stroke="currentColor" d={line(data)} />
        <g fill="white" stroke="currentColor" strokeWidth="1.5">
          {data.map((d, i) => (
            <circle
              key={i}
              cx={x(d.date)}
              cy={y(d.value)}
              r={2.5}
              onMouseOver={() => {
                tooltipRef.current.style.visibility = "visible";
              }}
              onMouseMove={(e) => {
                tooltipRef.current.style.top = e.pageY + "px";
                tooltipRef.current.style.left = e.pageX + "px";
                tooltipRef.current.textContent = d.value.toFixed(2);
              }}
              onMouseOut={() => {
                tooltipRef.current.style.visibility = "hidden";
              }}
            />
          ))}
        </g>
        <g transform={`translate(0, ${height - props.margin.bottom})`}>
          <g className="axis" ref={(node) => d3.select(node).call(xAxis)} />
        </g>
        <g transform={`translate(${props.margin.left}, 0)`}>
          <g className="axis" ref={(node) => d3.select(node).call(yAxis)} />
        </g>
      </svg>
      <div ref={tooltipRef} style={tooltipStyle}></div>
    </div>
  );
}

export default Chart;
