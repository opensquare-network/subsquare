const { MongoClient } = require("mongodb");

function getDbName() {
  return process.env.KNOWN_HEIGHTS_DB || "known-heights";
}

const heightCollectionName = "height";

let client = null;
let db = null;

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017";

let heightCol = null;

async function initDb() {
  client = await MongoClient.connect(mongoUrl, {
    useUnifiedTopology: true,
  });

  db = client.db(getDbName());
  heightCol = db.collection(heightCollectionName);

  await _createIndexes();
}

async function _createIndexes() {
  if (!db) {
    console.error("Please call initDb first");
    process.exit(1);
  }

  await heightCol.createIndex({ height: 1 }, { unique: true });
}

async function tryInit(col) {
  if (!col) {
    await initDb();
  }
}

async function getHeightCollection() {
  await tryInit(heightCol);
  return heightCol;
}

async function getNextKnownHeights(beginHeight) {
  const step = parseInt(process.env.SCAN_STEP) || 100;
  const col = await getHeightCollection();
  const records = await col
    .find({
      height: { $gte: beginHeight },
    })
    .sort({ height: 1 })
    .limit(step)
    .toArray();

  return (records || []).map((item) => item.height);
}

module.exports = {
  getHeightCollection,
  getNextKnownHeights,
};
