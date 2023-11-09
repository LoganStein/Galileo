import React, { useContext, useEffect, useRef, useState } from "react";
import { GetHistoricValue } from "../Helpers/GetHistoricValue";
import * as d3 from "d3";
import { TotalContext } from "./TotalContext";
import GetEffects from "../Helpers/GetEffects";
import { get } from "https-browserify";

function Chart({ margin = { top: 30, bottom: 30, left: 40, right: 30 } }) {
  const [data, setData] = useState([]);

  const totalContext = useContext(TotalContext);
  useEffect(() => {
    console.log("hello");

    async function getEffects() {
      let effects = await GetEffects(totalContext.totalState.acctID, 200);
      console.log("effects", effects);
      let historicValue = await GetHistoricValue(
        totalContext,
        effects._embedded.records,
        15
      );
      let values = [];
      historicValue.forEach((day) => {
        values.push(day.val.toFixed(2));
      });
      console.log("something values", values);
      setData(values.reverse());
    }
    getEffects();
  }, [totalContext]);

  const parentRef = useRef(null);

  const width = parentRef.current ? parentRef.current.offsetWidth : 0;
  const height = parentRef.current ? parentRef.current.offsetHeight : 0;

  const x = d3
    .scaleLinear()
    .domain([0, data.length - 1])
    .range([margin.left, width - margin.right]);

  const y = d3
    .scaleLinear()
    .domain(d3.extent(data))
    .range([height - margin.top, margin.bottom]);

  const line = d3
    .line()
    .x((d, i) => x(i))
    .y((d) => y(d));

  const xAxis = d3.axisBottom(x);

  const yAxis = d3.axisLeft(y);

  return (
    <div className="chart-placeholder" ref={parentRef}>
      <svg width="100%" height={height}>
        <path fill="none" stroke="currentColor" d={line(data)} />
        <g fill="white" stroke="currentColor" stroke-width="1.5">
          {data.map((d, i) => (
            <circle key={i} cx={x(i)} cy={y(d)} r={2.5} />
          ))}
        </g>
        <g transform={`translate(0, ${height - margin.bottom})`}>
          <g className="axis" ref={(node) => d3.select(node).call(xAxis)} />
        </g>
        <g transform={`translate(${margin.left}, 0)`}>
          <g className="axis" ref={(node) => d3.select(node).call(yAxis)} />
        </g>
      </svg>
    </div>
  );
}

export default Chart;
