const opencv = require('opencv4nodejs')
const imageRecognition = new ImageRecognition()

// Load image
const image = opencv.imread('path/to/image.jpg')

// Recognize objects
const recognizedObjects = imageRecognition.recognizeImage(image)

// Display recognized objects
for (let i = 0; i < recognizedObjects.length; i++) {
  const object = recognizedObjects[i]
  opencv.rectangle(image, object.object, [0, 255, 0], 2)
  opencv.putText(
    image,
    object.label,
    object.object.tl(),
    opencv.FONT_HERSHEY_SIMPLEX,
    1,
    [0, 255, 0],
    2
  )
}

// Display image
opencv.imshow('Image Recognition', image)
opencv.waitKey(0)
