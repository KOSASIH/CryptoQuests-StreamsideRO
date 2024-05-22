const tf = require('@tensorflow/tfjs');
const { Sequential } = require('@tensorflow/tfjs-layers');

async function trainPredictiveModel(trainingData, labels) {
  const model = new Sequential();
  model.add(tf.layers.dense({ units: 128, inputShape: [trainingData.shape[1]], activation: 'relu' }));
  model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
  model.add(tf.layers.dense({ units: labels.shape[1], activation: 'softmax' }));

  model.compile({
    optimizer: 'adam',
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy']
  });

  const history = await model.fit(trainingData, labels, {
    epochs: 10,
    batchSize: 32,
    validationSplit: 0.2
  });

  console.log(history.history.loss[0]);
  console.log(history.history.accuracy[0]);
}

module.exports = { trainPredictiveModel };
