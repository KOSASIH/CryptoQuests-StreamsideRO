class NeuralNetwork {
  constructor (inputNodes, hiddenNodes, outputNodes) {
    this.inputNodes = inputNodes
    this.hiddenNodes = hiddenNodes
    this.outputNodes = outputNodes

    this.weights_ih = new Matrix(this.hiddenNodes, this.inputNodes)
    this.weights_ho = new Matrix(this.outputNodes, this.hiddenNodes)

    this.weights_ih.randomize()
    this.weights_ho.randomize()

    this.bias_h = new Matrix(this.hiddenNodes, 1)
    this.bias_o = new Matrix(this.outputNodes, 1)

    this.bias_h.randomize()
    this.bias_o.randomize()

    this.learningRate = 0.1
  }

  sigmoid (x) {
    return 1 / (1 + Math.exp(-x))
  }

  sigmoidDerivative (x) {
    return x * (1 - x)
  }

  feedForward (inputs) {
    const inputsMatrix = Matrix.fromArray(inputs)
    const hiddenInputs = Matrix.multiply(this.weights_ih, inputsMatrix).add(
      this.bias_h
    )
    const hiddenOutputs = hiddenInputs.map(this.sigmoid)

    const finalInputs = Matrix.multiply(this.weights_ho, hiddenOutputs).add(
      this.bias_o
    )
    const finalOutputs = finalInputs.map(this.sigmoid)

    return finalOutputs.toArray()
  }

  train (inputs, targets) {
    const inputsMatrix = Matrix.fromArray(inputs)
    const hiddenInputs = Matrix.multiply(this.weights_ih, inputsMatrix).add(
      this.bias_h
    )
    const hiddenOutputs = hiddenInputs.map(this.sigmoid)

    const finalInputs = Matrix.multiply(this.weights_ho, hiddenOutputs).add(
      this.bias_o
    )
    const finalOutputs = finalInputs.map(this.sigmoid)

    const outputErrors = Matrix.fromArray(targets).subtract(finalOutputs)
    const gradient_ho = hiddenOutputs
      .map((x) => x * (1 - x))
      .multiply(Matrix.multiply(outputErrors, this.weights_ho.transpose()))
      .multiply(this.learningRate)
    this.weights_ho.add(gradient_ho)
    this.bias_o.add(outputErrors.map((x) => x * this.learningRate))

    const hiddenErrors = Matrix.multiply(
      this.weights_ho.transpose(),
      outputErrors
    ).map((x) => x * (1 - x))
    const gradient_ih = inputsMatrix
      .map((x) => x * (1 - x))
      .multiply(Matrix.multiply(hiddenErrors, this.weights_ih.transpose()))
      .multiply(this.learningRate)
    this.weights_ih.add(gradient_ih)
    this.bias_h.add(hiddenErrors.map((x) => x * this.learningRate))
  }
}

class Matrix {
  constructor (rows, cols) {
    this.rows = rows
    this.cols = cols
    this.data = []

    for (let i = 0; i < rows; i++) {
      const row = []
      for (let j = 0; j < cols; j++) {
        row.push(0)
      }
      this.data.push(row)
    }
  }

  randomize () {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.data[i][j] = Math.random() * 2 - 1
      }
    }
  }

  map (fn) {
    const mappedData = []
    for (let i = 0; i < this.rows; i++) {
      const row = []
      for (let j = 0; j < this.cols; j++) {
        row.push(fn(this.data[i][j]))
      }
      mappedData.push(row)
    }
    return new Matrix(this.rows, this.cols, mappedData)
  }

  static fromArray (arr) {
    const rows = arr.length
    const cols = arr[0].length
    const matrix = new Matrix(rows, cols)

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        matrix.data[i][j] = arr[i][j]
      }
    }

    return matrix
  }

  static multiply (a, b) {
    const aRows = a.rows
    const aCols = a.cols
    const bRows = b.rows
    const bCols = b.cols

    if (aCols !== bRows) {
      throw new Error('Matrices cannot be multiplied')
    }

    const result = new Matrix(aRows, bCols)

    for (let i = 0; i < aRows; i++) {
      for (let j = 0; j < bCols; j++) {
        let sum = 0
        for (let k = 0; k < aCols; k++) {
          sum += a.data[i][k] * b.data[k][j]
        }
        result.data[i][j] = sum
      }
    }

    return result
  }

  static transpose (matrix) {
    const transposed = new Matrix(matrix.cols, matrix.rows)

    for (let i = 0; i < matrix.rows; i++) {
      for (let j = 0; j < matrix.cols; j++) {
        transposed.data[j][i] = matrix.data[i][j]
      }
    }

    return transposed
  }

  add (matrix) {
    if (this.rows !== matrix.rows || this.cols !== matrix.cols) {
      throw new Error('Matrices cannot be added')
    }

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.data[i][j] += matrix.data[i][j]
      }
    }

    return this
  }

  subtract (matrix) {
    if (this.rows !== matrix.rows || this.cols !== matrix.cols) {
      throw new Error('Matrices cannot be subtracted')
    }

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.data[i][j] -= matrix.data[i][j]
      }
    }

    return this
  }
}
