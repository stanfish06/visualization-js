import * as d3 from "d3";
import * as THREE from "three";
import { SVGRenderer } from "three/examples/jsm/renderers/SVGRenderer.js";
import * as fs from "fs";
import { JSDOM } from "jsdom";
import pptxgen from "pptxgenjs";

export { D3DOM, ThreeDOM, PptxDeck, PptxSlide };

class ThreeDOM {
  constructor(renderer_width = 500, renderer_height = 500) {
    const dom = new JSDOM();
    const { document } = dom.window;
    this.dom = dom;
    // three js expects global doc
    global.document = document;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera();
    this.renderer = new SVGRenderer();
    this.renderer.setSize(renderer_width, renderer_height);
  }
  saveAsHTML(fname) {
    global.document.body.appendChild(this.renderer.domElement);
    const html = this.dom.serialize();
    fs.writeFileSync(fname, html);
  }
  saveAsSVG(fname) {
    const svg = this.renderer.domElement.outerHTML;
    fs.writeFileSync(fname, svg);
  }
}

class D3DOM {
  constructor() {
    const dom = new JSDOM();
    const { document } = dom.window;
    this.dom = dom;
    this.document = document;
    this.d3Container = d3.select(this.document.body);
  }
  createSVG(height, width) {
    // cant use d3.create, it uses global document
    const svg = this.document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg",
    );
    this.svg = d3.select(svg).attr("width", width).attr("height", height);
    this.d3Container.append(() => svg);
  }
  updateStyle(css) {
    const style = this.document.createElement("style");
    style.textContent = css;
    this.document.head.appendChild(style);
  }
  saveAsHTML(fname) {
    const html = this.dom.serialize();
    fs.writeFileSync(fname, html);
  }
  getSVGString() {
    return this.d3Container.select("svg").node().outerHTML;
  }
  saveAsSVG(fname) {
    fs.writeFileSync(fname, this.getSVGString());
  }
}

class PptxSlide {
  constructor(rawSlide) {
    this.raw = rawSlide;
  }
  addD3SVG(svgString, { x, y, w, h }) {
    const base64 = Buffer.from(svgString).toString("base64");
    this.raw.addImage({
      data: `data:image/svg+xml;base64,${base64}`,
      x,
      y,
      w,
      h,
    });
    return this;
  }
}

class PptxDeck {
  constructor({ layout = "LAYOUT_WIDE", template = {} } = {}) {
    this.pptx = new pptxgen();
    this.pptx.layout = layout;
    this.slideCount = 0;
    const defaults = {
      title: { x: 0.5, y: 0.2, fontSize: 24, bold: true, color: "333333" },
      text: { x: 0.5, y: 0.8, fontSize: 14, color: "666666" },
      slideNumber: { x: "90%", y: "95%", fontSize: 10, color: "999999" },
    };
    this.template = {
      title: { ...defaults.title, ...template.title },
      text: { ...defaults.text, ...template.text },
      slideNumber: { ...defaults.slideNumber, ...template.slideNumber },
    };
  }
  addSlide({ title, text, showSlideNumber = true } = {}) {
    this.slideCount++;
    const rawSlide = this.pptx.addSlide();
    if (title) {
      rawSlide.addText(title, this.template.title);
    }
    if (text) {
      rawSlide.addText(text, this.template.text);
    }
    if (showSlideNumber) {
      rawSlide.addText(String(this.slideCount), this.template.slideNumber);
    }
    return new PptxSlide(rawSlide);
  }
  async save(fileName) {
    return this.pptx.writeFile({ fileName });
  }
}

// const testObj = new ThreeDOM();
// testObj.saveAsHTML("test.html");
// testObj.saveAsSVG("test.svg");

// const data = [
//   { x: 50, y: 50 },
//   { x: 70, y: 70 },
// ];
// const testObj = new D3DOM();
// testObj.createSVG(100, 100);
// testObj.svg
//   .selectAll("circle")
//   .data(data)
//   .enter()
//   .append("circle")
//   .attr("cx", (p) => p.x)
//   .attr("cy", (p) => p.y)
//   .attr("r", 5)
//   .attr("fill", "red");
// testObj.saveAsHTML("test.html");
// testObj.saveAsSVG("test.svg");
