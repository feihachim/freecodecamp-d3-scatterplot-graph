"use strict";

const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
let dataset;

let xScale;
let yScale;

const width = 800;
const height = 600;
const padding = 40;

const svg = d3.select("svg");
const tooltip = d3.select("#tooltip");

const drawCanvas = () => {
  svg.attr("width", width).attr("height", height);
};

const generateScales = () => {
  xScale = d3
    .scaleLinear()
    .domain([
      d3.min(dataset, (item) => item["Year"]) - 1,
      d3.max(dataset, (item) => item["Year"]) + 1,
    ])
    .range([padding, width - padding]);
  yScale = d3
    .scaleTime()
    .domain([
      d3.min(dataset, (item) => new Date(item["Seconds"] * 1000)),
      d3.max(dataset, (item) => new Date(item["Seconds"] * 1000)),
    ])
    .range([padding, height - padding]);
};

const drawPoints = () => {
  svg
    .selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("r", 5)
    .attr("data-xvalue", (item) => item["Year"])
    .attr("data-yvalue", (item) => new Date(item["Seconds"] * 1000))
    .attr("cx", (item) => xScale(item["Year"]))
    .attr("cy", (item) => yScale(new Date(item["Seconds"] * 1000)))
    .attr("fill", (item) => (item["Doping"] ? "orange" : "lightgreen"))
    .on("mouseover", (event, item) => {
      tooltip
        .transition()
        .style("visibility", "visible")
        .text(
          item["Doping"]
            ? `${item["Year"]} - ${item["Name"]} - ${item["Time"]} - ${item["Doping"]}`
            : `${item["Year"]} - ${item["Name"]} - ${item["Time"]} - No Allegations`
        )
        .attr("data-year", item["Year"]);
    })
    .on("mouseout", (event, item) => {
      tooltip.transition().style("visibility", "hidden");
    });
};

const generateAxes = () => {
  let xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  let yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", `translate(0,${height - padding})`);

  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding},0)`);
};

d3.json(url).then((data) => {
  dataset = data;

  drawCanvas();
  generateScales();
  drawPoints();
  generateAxes();
});
