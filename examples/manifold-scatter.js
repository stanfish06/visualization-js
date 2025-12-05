import * as d3 from "d3";
import { D3DOM } from "../lib.js";

const data = (() => {
  const random = d3.randomNormal(0, 1);
  return [].concat(
    Array.from({ length: 300 }, () => [random() + 50, random() + 50, 0]),
    Array.from({ length: 300 }, () => [random() + 45, random() + 45, 1]),
  );
})();

const x = d3.scaleLinear().domain([40, 55]).range([0, 800]);

const y = d3.scaleLinear().domain([40, 55]).range([800, 0]);

const scatter = new D3DOM();
scatter.createSVG(1000, 1000);
scatter.svg
  .append("g")
  .attr("transform", "translate(0, 900)")
  .call(d3.axisBottom(x));
scatter.svg
  .append("g")
  .attr("transform", "translate(50, 0)")
  .call(d3.axisLeft(y));
scatter.svg
  .selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr("cx", (d) => x(d[0]))
  .attr("cy", (d) => y(d[1]))
  .attr("r", 3)
  .attr("fill", (d) => (d[2] === 0 ? "red" : "blue"));
scatter.saveAsHTML("test.html");
