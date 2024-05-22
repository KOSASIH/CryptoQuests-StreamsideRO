const { promisify } = require('util');
const readline = require('readline');
const { KMeans } = require('@tensorflow/tfjs-node');

const fileReader = promisify(readline.createInterface({ input: fs.createReadStream('path/to/your/data/file') }));

async function analyzeData() {
  const data = [];

  for await (const line of fileReader) {
    const playerData = JSON.parse(line);
    data.push([playerData.position.x, playerData.position.y, playerData.score]);
  }

  const kmeans = new KMeans({ k: 5 });
  await kmeans.fit(tf.tensor2d(data));

  console.log('Cluster centroids:');
  console.log(await kmeans.clusterCentroids().array());
}

analyzeData();
