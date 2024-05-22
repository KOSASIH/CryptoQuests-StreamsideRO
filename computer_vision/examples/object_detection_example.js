const opencv = require("opencv4nodejs");
const objectDetection = new ObjectDetection();

// Load image
let image = opencv.imread("path/to/image.jpg");

// Detect objects
image = objectDetection.detectObjects(image);

// Display image
opencv.imshow("Object Detection", image);
opencv.waitKey(0);
