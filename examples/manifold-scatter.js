import * as d3 from "d3";
import { D3DOM } from "../lib.js";
// create container
const scatter = new D3DOM();

// svg parameters
const margin = {top: 20, right: 20, bottom: 50, left: 50}
const width = 800 + margin.left + margin.right;
const height = 800 + margin.top + margin.bottom;
scatter.createSVG(width, height);

// data
const data = (() => {
  const random = d3.randomNormal(0, 1);
  return [].concat(
    Array.from({ length: 300 }, () => [random() + 50, random() + 50, 0]),
    Array.from({ length: 300 }, () => [random() + 45, random() + 45, 1]),
  );
})();

// themes
const theme = `
  svg { background: #1a1a1a; }
  
  .cluster-0 {
    fill: #ff6b6b;
    opacity: 0.7;
  }

  .cluster-1 {
    fill: #ff6b6b;
    opacity: 0.7;
  }
`
scatter.updateStyle(theme)

// axes
const x = d3.scaleLinear().domain([40, 55]).range([margin.left, width - margin.right]);
const y = d3.scaleLinear().domain([40, 55]).range([height - margin.bottom, margin.top]);

// apply data to svg
scatter.svg
  .append("g")
  .attr("transform", `translate(0, ${height - margin.bottom})`)
  .call(d3.axisBottom(x));
scatter.svg
  .append("g")
  .attr("transform", `translate(${margin.left}, 0)`)
  .call(d3.axisLeft(y));
scatter.svg
  .selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr("cx", (d) => x(d[0]))
  .attr("cy", (d) => y(d[1]))
  .attr("r", 3)
  .attr("class", (d) => (d[2] === 0 ? "cluster-0" : "cluster-1"));

// export
scatter.saveAsHTML("test.html");
