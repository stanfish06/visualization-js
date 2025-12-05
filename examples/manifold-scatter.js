import * as d3 from "d3";
import { D3DOM } from "../lib.js";
// create container
const scatter = new D3DOM();

// svg parameters
const margin = { top: 20, right: 20, bottom: 50, left: 50 };
const width = 800 + margin.left + margin.right;
const height = 800 + margin.top + margin.bottom;
scatter.createSVG(width, height);

// data - spiral with depth
const data = (() => {
  const points = [];
  const noise = d3.randomNormal(0, 0.5);
  for (let i = 0; i < 400; i++) {
    const t = i / 60;
    const x = t * Math.cos(t) + 47.5 + noise();
    const y = t * Math.sin(t) + 47.5 + noise();
    const z = t;
    points.push([x, y, z]);
  }
  return points;
})();

// themes
const theme = `
  svg { background: #f5f5f5; }

  .point {
    stroke: white;
    stroke-width: 1.0;
  }
`;
scatter.updateStyle(theme);

// axes
const x = d3
  .scaleLinear()
  .domain([40, 55])
  .range([margin.left, width - margin.right]);
const y = d3
  .scaleLinear()
  .domain([40, 55])
  .range([height - margin.bottom, margin.top]);

// draw background spiral tube
const spiralPath = d3
  .line()
  .x((d) => x(d[0]))
  .y((d) => y(d[1]))
  .curve(d3.curveCatmullRom);

scatter.svg
  .append("path")
  .datum(data)
  .attr("class", "manifold-bg")
  .attr("d", spiralPath)
  .attr("stroke", "#c0c0c0")
  .attr("stroke-width", 20)
  .attr("fill", "none");

// apply data to svg
scatter.svg
  .append("g")
  .attr("transform", `translate(0, ${height - margin.bottom})`)
  .call(d3.axisBottom(x));
scatter.svg
  .append("g")
  .attr("transform", `translate(${margin.left}, 0)`)
  .call(d3.axisLeft(y));

// draw points with depth cues (pseudotime)
const maxZ = d3.max(data, (d) => d[2]);
const colorScale = d3.scaleSequential(d3.interpolateViridis).domain([0, maxZ]);

scatter.svg
  .selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr("cx", (d) => x(d[0]))
  .attr("cy", (d) => y(d[1]))
  .attr("r", 3) // size by depth
  .attr("fill", (d) => colorScale(d[2])) // color by depth
  .attr("opacity", 0.7) // fade by depth
  .attr("class", "point");

// export
scatter.saveAsHTML("test.html");
