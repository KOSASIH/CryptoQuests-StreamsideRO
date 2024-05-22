const nmap = require('node-nmap');

function runPenetrationTest(target, options) {
  return new Promise((resolve, reject) => {
    nmap.scan(target, options, (err, report) => {
      if (err) reject(err);
      resolve(report);
    });
  });
}

module.exports = { runPenetrationTest };
