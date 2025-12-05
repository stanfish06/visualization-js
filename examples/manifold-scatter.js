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
  const noise = d3.randomNormal.source(d3.randomLcg(42))(0, 0.2);
  for (let i = 250; i < 2000; i++) {
    const t = i * 0.005;
    for (let j = 0; j < 3; j++) {
      const x = 0.3 * t * Math.cos(t) + 47.5 + noise();
      const y = 0.3 * t * Math.sin(t) + 47.5 + noise();
      const z = t;
      points.push([x, y, z]);
    }
  }
  return points;
})();

// themes
const theme = `
  svg { background: #ffffff; }

  .point {
    stroke: black;
    stroke-width: 1.0;
  }
`;
scatter.updateStyle(theme);

// axes - adapt to data
const xExtent = d3.extent(data, (d) => d[0]);
const yExtent = d3.extent(data, (d) => d[1]);
const x = d3
  .scaleLinear()
  .domain(xExtent)
  .range([margin.left, width - margin.right])
  .nice();
const y = d3
  .scaleLinear()
  .domain(yExtent)
  .range([height - margin.bottom, margin.top])
  .nice();

// draw background spiral manifold with tube effect
const manifoldPath = (() => {
  const points = [];
  for (let i = 115; i < 1005; i++) {
    const t = i / 100;
    points.push([0.3 * t * Math.cos(t) + 47.5, 0.3 * t * Math.sin(t) + 47.5]);
  }
  return points;
})();

const spiralPath = d3
  .line()
  .x((d) => x(d[0]))
  .y((d) => y(d[1]))
  .curve(d3.curveCatmullRom);

// Add filters for 3D effects
const defs = scatter.svg.append("defs");

// Blur filter for manifold
const tubeFilter = defs.append("filter").attr("id", "tubeBlur");
tubeFilter
  .append("feGaussianBlur")
  .attr("in", "SourceGraphic")
  .attr("stdDeviation", 3);

// Drop shadow filter for points
const shadowFilter = defs
  .append("filter")
  .attr("id", "dropShadow")
  .attr("x", "-50%")
  .attr("y", "-50%")
  .attr("width", "200%")
  .attr("height", "200%");

shadowFilter
  .append("feGaussianBlur")
  .attr("in", "SourceAlpha")
  .attr("stdDeviation", 2);

shadowFilter
  .append("feOffset")
  .attr("dx", 2)
  .attr("dy", 2)
  .attr("result", "offsetblur");

shadowFilter
  .append("feComponentTransfer")
  .append("feFuncA")
  .attr("type", "linear")
  .attr("slope", 0.6);

const feMerge = shadowFilter.append("feMerge");
feMerge.append("feMergeNode");
feMerge.append("feMergeNode").attr("in", "SourceGraphic");

// Multi-layer tube for smooth 3D gradient
scatter.svg
  .append("path")
  .datum(manifoldPath)
  .attr("d", spiralPath)
  .attr("stroke", "#c8c8c8")
  .attr("stroke-width", 100)
  .attr("stroke-linecap", "round")
  .attr("fill", "none");

scatter.svg
  .append("path")
  .datum(manifoldPath)
  .attr("d", spiralPath)
  .attr("stroke", "#a8a8a8")
  .attr("stroke-width", 85)
  .attr("stroke-linecap", "round")
  .attr("fill", "none")
  .attr("filter", "url(#tubeBlur)");

scatter.svg
  .append("path")
  .datum(manifoldPath)
  .attr("d", spiralPath)
  .attr("stroke", "#888888")
  .attr("stroke-width", 70)
  .attr("stroke-linecap", "round")
  .attr("fill", "none")
  .attr("filter", "url(#tubeBlur)");

// apply data to svg
const defs2 = scatter.svg.append("defs");
defs2
  .append("marker")
  .attr("id", "arrowhead")
  .attr("markerWidth", 10)
  .attr("markerHeight", 10)
  .attr("refX", 9)
  .attr("refY", 3)
  .attr("orient", "auto")
  .append("polygon")
  .attr("points", "0 0, 10 3, 0 6")
  .attr("fill", "black");

// X-axis with arrow
const xAxis = scatter.svg
  .append("g")
  .attr("transform", `translate(0, ${height - margin.bottom + 5})`);

xAxis.call(d3.axisBottom(x).tickSize(0).tickFormat(""));
xAxis.select(".domain").remove();

xAxis
  .append("line")
  .attr("x1", margin.left - 5)
  .attr("x2", margin.left - 5 + (width - margin.right - margin.left) * 0.5)
  .attr("y1", 0)
  .attr("y2", 0)
  .attr("stroke", "black")
  .attr("stroke-width", 2)
  .attr("marker-end", "url(#arrowhead)");

xAxis
  .append("text")
  .attr("x", margin.left - 5 + (width - margin.right - margin.left) * 0.5 + 30)
  .attr("y", 5)
  .attr("fill", "black")
  .attr("font-size", "35px")
  .text("g1");

// Y-axis with arrow
const yAxis = scatter.svg
  .append("g")
  .attr("transform", `translate(${margin.left - 5}, 0)`);

yAxis.call(d3.axisLeft(y).tickSize(0).tickFormat(""));
yAxis.select(".domain").remove();

yAxis
  .append("line")
  .attr("x1", 0)
  .attr("x2", 0)
  .attr("y1", height - margin.bottom + 5)
  .attr(
    "y2",
    height - margin.bottom + 5 - (height - margin.bottom - margin.top) * 0.5,
  )
  .attr("stroke", "black")
  .attr("stroke-width", 2)
  .attr("marker-end", "url(#arrowhead)");

yAxis
  .append("text")
  .attr("x", 15)
  .attr(
    "y",
    height -
      margin.bottom +
      5 -
      (height - margin.bottom - margin.top) * 0.5 -
      15,
  )
  .attr("fill", "black")
  .attr("font-size", "35px")
  .text("g2");

// draw points with color (pseudotime)
const maxZ = d3.max(data, (d) => d[2]);
const colorScale = d3.scaleSequential(d3.interpolateTurbo).domain([0, maxZ]);

scatter.svg
  .selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr("cx", (d) => x(d[0]))
  .attr("cy", (d) => y(d[1]))
  .attr("r", 3)
  .attr("fill", (d) => colorScale(d[2]))
  .attr("opacity", 0.8)
  .attr("class", "point")
  .attr("filter", "url(#dropShadow)");

// Add color bar legend
const legendGroup = scatter.svg
  .append("g")
  .attr(
    "transform",
    `translate(${width - margin.right - 60}, ${(height - margin.bottom - margin.top) * 0.5 + margin.top})`,
  );

const legendGradient = defs
  .append("linearGradient")
  .attr("id", "legendGradient")
  .attr("x1", "0%")
  .attr("y1", "0%")
  .attr("x2", "0%")
  .attr("y2", "100%");

for (let i = 0; i <= 10; i++) {
  legendGradient
    .append("stop")
    .attr("offset", `${i * 10}%`)
    .attr("stop-color", colorScale(maxZ * (1 - i / 10)));
}

const arrowPath = d3.path();
arrowPath.moveTo(0, 80);
arrowPath.bezierCurveTo(10, 40, 10, -40, 0, -80);

legendGroup
  .append("path")
  .attr("d", arrowPath.toString())
  .attr("stroke", "#333")
  .attr("stroke-width", 2.5)
  .attr("fill", "none")
  .attr("marker-end", "url(#legendArrow)");

defs
  .append("marker")
  .attr("id", "legendArrow")
  .attr("markerWidth", 10)
  .attr("markerHeight", 10)
  .attr("refX", 9)
  .attr("refY", 3)
  .attr("orient", "auto")
  .append("polygon")
  .attr("points", "0 0, 10 3, 0 6")
  .attr("fill", "#333");

legendGroup
  .append("rect")
  .attr("x", 15)
  .attr("y", -80)
  .attr("width", 15)
  .attr("height", 160)
  .attr("fill", "url(#legendGradient)")
  .attr("stroke", "#333")
  .attr("stroke-width", 1);

legendGroup
  .append("text")
  .attr("x", -15)
  .attr("y", -90)
  .attr("font-size", "35px")
  .attr("fill", "#333")
  .text("late");

legendGroup
  .append("text")
  .attr("x", -15)
  .attr("y", 110)
  .attr("font-size", "35px")
  .attr("fill", "#333")
  .text("early");

// export
// scatter.saveAsHTML("./examples/manifold-scatter.html");
scatter.saveAsSVG("./examples/manifold-scatter.svg");
