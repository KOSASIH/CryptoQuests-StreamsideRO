const opencv = require('opencv4nodejs')

class ImageRecognition {
  constructor () {
    this.classifier = new opencv.CascadeClassifier(
      opencv.path.join(__dirname, 'cascades', 'classifier.xml')
    )
  }

  recognizeImage (image) {
    const grayImage = new opencv.Mat()
    opencv.cvtColor(image, grayImage, opencv.COLOR_RGBA2GRAY)

    const objects = new opencv.RectVector()
    this.classifier.detectMultiScale(grayImage, objects, 1.1, 3, 0)

    const recognizedObjects = []
    for (let i = 0; i < objects.size(); i++) {
      const object = objects.get(i)
      const roi = grayImage.roi(object)
      const descriptors = this.computeDescriptors(roi)

      const label = this.predictLabel(descriptors)
      recognizedObjects.push({
        label,
        object
      })
    }

    return recognizedObjects
  }

  computeDescriptors (image) {
    const orb = new opencv.ORB()
    const descriptors = new opencv.Mat()
    orb.detectAndCompute(image, new opencv.Mat(), descriptors, null)
    return descriptors
  }

  predictLabel (descriptors) {
    const knn = new opencv.KNearest()
    const labels = new opencv.Mat([0, 1, 2, 3, 4], opencv.CV_32SC1)
    const trainData = new opencv.MatVector()

    // Load training data
    for (let i = 0; i < 5; i++) {
      const trainImage = opencv.imread(
        opencv.path.join(__dirname, 'training', `${i}.jpg`)
      )
      const trainDescriptors = this.computeDescriptors(trainImage)
      trainData.push(trainDescriptors)
    }

    // Train KNN classifier
    knn.train(trainData, labels)

    // Predict label
    const response = new opencv.Mat()
    knn.findNearest(descriptors, 1, response)
    return response.ucharAt(0, 0)
  }
}
