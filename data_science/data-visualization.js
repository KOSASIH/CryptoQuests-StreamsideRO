const { chart } = require('highcharts')

function visualizeData (data) {
  chart('container', {
    series: [
      {
        type: 'scatter',
        data
      }
    ]
  })
}

module.exports = { visualizeData }
