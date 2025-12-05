import * as d3 from 'd3'
import * as fs from 'fs'
import { JSDOM } from 'jsdom'

class D3DOM {
    constructor() {
        const dom = new JSDOM();
        const { document } = dom.window;
        this.dom = dom;
        this.document = document;
        this.d3Container = d3.select(this.document.body) 
    }
    createSVG(height, width) {
        // cant use d3.create, it uses global document
        const svg = this.document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.svg = d3.select(svg).attr("width", width).attr("height", height);
        this.d3Container.append(() => svg);
    }
    saveAsHTML(fname) {
        const html = this.dom.serialize();
        fs.writeFileSync(fname, html);
    }
    saveAsSVG(fname) {
        const svg = this.d3Container.select("svg").node();
        fs.writeFileSync(fname, svg.outerHTML);
    }
}

const data = [
    {x: 50, y: 50},
    {x: 70, y: 70},
]
const testObj = new D3DOM();
testObj.createSVG(100, 100);
testObj.svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", p => p.x)
    .attr("cy", p => p.y)
    .attr("r", 5)
    .attr("fill", "red")
testObj.saveAsHTML("test.html");
testObj.saveAsSVG("test.svg");
