const opencv = require('opencv4nodejs')

class ObjectDetection {
  constructor () {
    this.classifier = new opencv.CascadeClassifier(
      opencv.path.join(__dirname, 'cascades', 'cascade.xml')
    )
  }

  detectObjects (image) {
    const grayImage = new opencv.Mat()
    opencv.cvtColor(image, grayImage, opencv.COLOR_RGBA2GRAY)

    const objects = new opencv.RectVector()
    this.classifier.detectMultiScale(grayImage, objects, 1.1, 3, 0)

    for (let i = 0; i < objects.size(); i++) {
      const object = objects.get(i)
      opencv.rectangle(image, object, [0, 255, 0], 2)
    }

    return image
  }
}
