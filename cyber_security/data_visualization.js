const { promisify } = require('util');
const fs = require('fs');
const csv = require('csvtojson');
const Plotly = require('plotly.js-basic-dist');

const loadCSV = async (filePath) => {
  const readFile = promisify(fs.readFile);
  const data = await readFile(filePath, 'utf8');
  const jsonData = await csv().fromString(data);
  return jsonData;
};

const createScatterPlot = (data, xField, yField, title, xLabel, yLabel) => {
  const trace = {
    x: data.map((row) => row[xField]),
    y: data.map((row) => row[yField]),
    mode: 'markers',
    type: 'scatter',
    name: 'Data',
  };

  const layout = {
    title: title,
    xaxis: {
      title: xLabel,
    },
    yaxis: {
      title: yLabel,
    },
  };

  const config = {
    responsive: true,
  };

  Plotly.newPlot('plot', [trace], layout, config);
};

const createBarChart = (data, field, title, xLabel, yLabel) => {
  const trace = {
    x: data.map((row) => row[field]),
    y: data.map((row) => row.count),
    type: 'bar',
  };

  const layout = {
    title: title,
    xaxis: {
      title: xLabel,
    },
    yaxis: {
      title: yLabel,
    },
  };

  const config = {
    responsive: true,
  };

  Plotly.newPlot('plot', [trace], layout, config);
};

module.exports = {
  loadCSV,
  createScatterPlot,
  createBarChart,
};
