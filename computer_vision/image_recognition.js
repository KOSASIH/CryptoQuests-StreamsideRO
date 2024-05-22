const opencv = require("opencv4nodejs");

class ImageRecognition {
  constructor() {
    this.classifier = new opencv.CascadeClassifier(opencv.path.join(__dirname, "cascades", "classifier.xml"));
  }

  recognizeImage(image) {
    let grayImage = new opencv.Mat();
    opencv.cvtColor(image, grayImage, opencv.COLOR_RGBA2GRAY);

    let objects = new opencv.RectVector();
    this.classifier.detectMultiScale(grayImage, objects, 1.1, 3, 0);

    let recognizedObjects = [];
    for (let i = 0; i < objects.size(); i++) {
      let object = objects.get(i);
      let roi = grayImage.roi(object);
      let descriptors = this.computeDescriptors(roi);

      let label = this.predictLabel(descriptors);
      recognizedObjects.push({
        label: label,
        object: object
      });
    }

    return recognizedObjects;
  }

  computeDescriptors(image) {
    let orb = new opencv.ORB();
    let descriptors = new opencv.Mat();
    orb.detectAndCompute(image, new opencv.Mat(), descriptors, null);
    return descriptors;
  }

  predictLabel(descriptors) {
    let knn = new opencv.KNearest();
    let labels = new opencv.Mat([0, 1, 2, 3, 4], opencv.CV_32SC1);
    let trainData = new opencv.MatVector();

    // Load training data
    for (let i = 0; i < 5;i++) {
      let trainImage = opencv.imread(opencv.path.join(__dirname, "training", `${i}.jpg`));
      let trainDescriptors = this.computeDescriptors(trainImage);
      trainData.push(trainDescriptors);
    }

    // Train KNN classifier
    knn.train(trainData, labels);

    // Predict label
    let response = new opencv.Mat();
    knn.findNearest(descriptors, 1, response);
    return response.ucharAt(0, 0);
  }
}
