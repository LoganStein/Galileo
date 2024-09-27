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
  const tooltipRef = useRef(null);
  const margin = props.margin;

  const parentRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });

    if (parentRef.current) {
      resizeObserver.observe(parentRef.current);
    }

    return () => {
      if (parentRef.current) {
        resizeObserver.unobserve(parentRef.current);
      }
    };
  }, []);

  // const width = parentRef.current ? parentRef.current.offsetWidth : 0;
  // const height = parentRef.current ? parentRef.current.offsetHeight : 0;
  const width = dimensions.width - margin.left - margin.right;
  const height = dimensions.height - margin.top - margin.bottom;

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
