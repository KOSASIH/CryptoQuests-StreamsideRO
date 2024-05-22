let NPC = function(input) {
  this.input = input;
  this.weights = [Math.random(), Math.random()];

  this.predict = function() {
    return this.weights[0] * this.input[0] + this.weights[1] * this.input[1];
  };

  this.updateWeights = function(error, input, learningRate) {
    this.weights[0] += learningRate * error * input[0];
    this.weights[1] += learningRate * error * input[1];
  };
};

let trainingData = [[0, 0], [0, 1], [1, 0], [1, 1]];
let trainingLabels = [0, 1, 1, 0];

let ml = new MachineLearning(NPC, trainingData, trainingLabels, 0.1, 1000);
ml.run();
