const nn = new NeuralNetwork(2, 4, 1)

const inputs = [
  [0, 0],
  [0, 1],
  [1, 0],
  [1, 1]
]
const targets = [[0], [1], [1], [0]]

for (let i = 0; i < 10000; i++) {
  for (let j = 0; j < inputs.length; j++) {
    nn.train(inputs[j], targets[j])
  }
}

for (let i = 0; i < inputs.length; i++) {
  const output = nn.feedForward(inputs[i])
  console.log(`Input: ${inputs[i]}, Output: ${output}`)
}
