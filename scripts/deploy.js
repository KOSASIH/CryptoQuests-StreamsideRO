// scripts/deploy.js

const { MONGODB_URI, VERCEL_PROJECT_ID, VERCEL_TOKEN } = process.env;

if (!MONGODB_URI || !VERCEL_PROJECT_ID || !VERCEL_TOKEN) {
  console.error(
    "Missing environment variables. Make sure you've set MONGODB_URI, VERCEL_PROJECT_ID, and VERCEL_TOKEN."
  );
  process.exit(1);
}

const { MongoClient } = require("mongodb");
const { deploy } = require("vercel-deploy");

const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function main() {
  try {
    await client.connect();
    const db = client.db();

    // You can add any necessary data migration or setup logic here, if needed

    await deploy({
      projectId: VERCEL_PROJECT_ID,
      token: VERCEL_TOKEN,
      env: {
        MONGODB_URI,
      },
      onDeploy: async () => {
        // You can add any necessary post-deployment logic here, if needed
      },
    });

    console.log("Deployment successful!");
  } catch (error) {
    console.error("Deployment failed:", error);
  } finally {
    await client.close();
  }
}

main();
