class NeuralNetwork {
  constructor(inputNodes, hiddenNodes, outputNodes) {
    this.inputNodes = inputNodes;
    this.hiddenNodes = hiddenNodes;
    this.outputNodes = outputNodes;

    this.weights_ih = new Matrix(this.hiddenNodes, this.inputNodes);
    this.weights_ho = new Matrix(this.outputNodes, this.hiddenNodes);

    this.weights_ih.randomize();
    this.weights_ho.randomize();

    this.bias_h = new Matrix(this.hiddenNodes, 1);
    this.bias_o = new Matrix(this.outputNodes, 1);

    this.bias_h.randomize();
    this.bias_o.randomize();

    this.learningRate = 0.1;
  }

  sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }

  sigmoidDerivative(x) {
    return x * (1 - x);
  }

  feedForward(inputs) {
    let inputsMatrix = Matrix.fromArray(inputs);
    let hiddenInputs = Matrix.multiply(this.weights_ih, inputsMatrix).add(this.bias_h);
    let hiddenOutputs = hiddenInputs.map(this.sigmoid);

    let finalInputs = Matrix.multiply(this.weights_ho, hiddenOutputs).add(this.bias_o);
    let finalOutputs = finalInputs.map(this.sigmoid);

    return finalOutputs.toArray();
  }

  train(inputs, targets) {
    let inputsMatrix = Matrix.fromArray(inputs);
    let hiddenInputs = Matrix.multiply(this.weights_ih, inputsMatrix).add(this.bias_h);
    let hiddenOutputs = hiddenInputs.map(this.sigmoid);

    let finalInputs = Matrix.multiply(this.weights_ho, hiddenOutputs).add(this.bias_o);
    let finalOutputs = finalInputs.map(this.sigmoid);

    let outputErrors = Matrix.fromArray(targets).subtract(finalOutputs);
    let gradient_ho = hiddenOutputs.map(x => x * (1 - x)).multiply(Matrix.multiply(outputErrors, this.weights_ho.transpose())).multiply(this.learningRate);
    this.weights_ho.add(gradient_ho);
    this.bias_o.add(outputErrors.map(x => x * this.learningRate));

    let hiddenErrors = Matrix.multiply(this.weights_ho.transpose(), outputErrors).map(x => x * (1 - x));
    let gradient_ih = inputsMatrix.map(x => x * (1 - x)).multiply(Matrix.multiply(hiddenErrors, this.weights_ih.transpose())).multiply(this.learningRate);
    this.weights_ih.add(gradient_ih);
    this.bias_h.add(hiddenErrors.map(x => x * this.learningRate));
  }
}

class Matrix {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.data = [];

    for (let i = 0; i < rows; i++) {
      let row = [];
      for (let j = 0; j < cols; j++) {
        row.push(0);
      }
      this.data.push(row);
    }
  }

  randomize() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.data[i][j] = Math.random() * 2 - 1;
      }
    }
  }

  map(fn) {
    let mappedData = [];
    for (let i = 0; i < this.rows; i++) {
      let row = [];
      for (let j = 0; j < this.cols; j++) {
        row.push(fn(this.data[i][j]));
      }
      mappedData.push(row);
    }
    return new Matrix(this.rows, this.cols, mappedData);
  }

  static fromArray(arr) {
    let rows = arr.length;
    let cols = arr[0].length;
    let matrix = new Matrix(rows, cols);

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        matrix.data[i][j] = arr[i][j];
      }
    }

    return matrix;
  }

  static multiply(a, b) {
    let aRows = a.rows;
    let aCols = a.cols;
    let bRows = b.rows;
    let bCols = b.cols;

    if (aCols !== bRows) {
      throw new Error("Matrices cannot be multiplied");
    }

    let result = new Matrix(aRows, bCols);

    for (let i = 0; i < aRows; i++) {
      for (let j = 0; j < bCols; j++) {
        let sum = 0;
        for (let k = 0; k < aCols; k++) {
          sum += a.data[i][k] * b.data[k][j];
        }
        result.data[i][j] = sum;
      }
    }

    return result;
  }

  static transpose(matrix) {
    let transposed = new Matrix(matrix.cols, matrix.rows);

    for (let i = 0; i < matrix.rows; i++) {
      for (let j = 0; j < matrix.cols; j++) {
        transposed.data[j][i] = matrix.data[i][j];
      }
    }

    return transposed;
  }

  add(matrix) {
    if (this.rows !== matrix.rows || this.cols !== matrix.cols) {
      throw new Error("Matrices cannot be added");
    }

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.data[i][j] += matrix.data[i][j];
      }
    }

    return this;
  }

  subtract(matrix) {
    if (this.rows !== matrix.rows || this.cols !== matrix.cols) {
      throw new Error("Matrices cannot be subtracted");
    }

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.data[i][j] -= matrix.data[i][j];
      }
    }

    return this;
  }
}
