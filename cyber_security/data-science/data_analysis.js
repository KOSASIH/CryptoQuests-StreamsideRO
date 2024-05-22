const { promisify } = require('util');
const csv = require('csvtojson');
const math = require('mathjs');

const loadCSV = async (filePath) => {
  const readFile = promisify(fs.readFile);
  const data = await readFile(filePath, 'utf8');
  const jsonData = await csv().fromString(data);
  return jsonData;
};

const calculateMean = (data, field) => {
  const values = data.map((row) => row[field]);
  const mean = math.mean(values);
  return mean;
};

const calculateMedian = (data, field) => {
  const values = data.map((row) => row[field]);
  const median = math.median(values);
  return median;
};

const calculateMode = (data, field) => {
  const values = data.map((row) => row[field]);
  const mode = math.mode(values);
  return mode;
};

const calculateStandardDeviation = (data, field) => {
  const values = data.map((row) => row[field]);
  const stdDev = math.std(values);
  return stdDev;
};

const calculateVariance =(data, field) => {
  const values = data.map((row) => row[field]);
  const variance = math.variance(values);
  return variance;
};

const calculateCorrelation = (data, field1, field2) => {
  const values1 = data.map((row) => row[field1]);
  const values2 = data.map((row) => row[field2]);
  const correlation = math.corrcoef(values1, values2)[0][1];
  return correlation;
};

const calculateRegression = (data, field1, field2) => {
  const values1 = data.map((row) => row[field1]);
  const values2 = data.map((row) => row[field2]);
  const regression = math.polyfit(values1, values2, 1);
  return regression;
};

module.exports = {
  loadCSV,
  calculateMean,
  calculateMedian,
  calculateMode,
  calculateStandardDeviation,
  calculateVariance,
  calculateCorrelation,
  calculateRegression,
};
