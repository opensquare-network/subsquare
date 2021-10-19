const { MongoClient } = require("mongodb");
const { currentChain, CHAINS } = require("../env");

function getDbName() {
  const chain = currentChain();
  if (CHAINS.KARURA === chain) {
    return process.env.MONGO_DB_META_KAR_NAME || "meta-karura";
  } else if (CHAINS.KUSAMA === chain) {
    return process.env.MONGO_DB_META_KSM_NAME || "meta-ksm";
  } else if (CHAINS.POLKADOT === chain) {
    return process.env.MONGO_DB_META_DOT_NAME || "meta-dot";
  }

  throw new Error("Not find metadata database");
}

const blockCollectionName = "block";
const statusCollectionName = "status";
const versionCollectionName = "version";

let client = null;
let db = null;
let versionCol = null;

const mongoUrl = process.env.MONGO_DB_META_URL || "mongodb://localhost:27017";

let statusCol = null;
let blockCol = null;

async function initDb() {
  client = await MongoClient.connect(mongoUrl, {
    useUnifiedTopology: true,
  });

  db = client.db(getDbName());
  statusCol = db.collection(statusCollectionName);
  blockCol = db.collection(blockCollectionName);
  versionCol = db.collection(versionCollectionName);

  await _createIndexes();
}

async function _createIndexes() {
  if (!db) {
    console.error("Please call initDb first");
    process.exit(1);
  }

  await blockCol.createIndex({ height: -1 }, { unique: true });
  // TODO: create indexes for better query performance
}

async function tryInit(col) {
  if (!col) {
    await initDb();
  }
}

async function getStatusCollection() {
  await tryInit(statusCol);
  return statusCol;
}

async function getBlockCollection() {
  await tryInit(blockCol);
  return blockCol;
}

async function getVersionCollection() {
  await tryInit(versionCol);
  return versionCol;
}

async function getBlocks(startHeight, endHeight) {
  const col = await getBlockCollection();
  return await col
    .find({
      $and: [
        { height: { $gte: startHeight } },
        { height: { $lte: endHeight } },
      ],
    })
    .sort({ height: 1 })
    .toArray();
}

async function getBlocksByHeights(heights = []) {
  if (heights.length <= 0) {
    return [];
  }

  const col = await getBlockCollection();
  return await col
    .find({
      height: { $in: heights },
    })
    .sort({ height: 1 })
    .toArray();
}

async function getAllVersionChangeHeights() {
  const col = await getVersionCollection();
  const versions = await col.find({}).sort({ height: 1 }).toArray();
  return (versions || []).map((v) => v.height);
}

module.exports = {
  getStatusCollection,
  getBlockCollection,
  getBlocks,
  getAllVersionChangeHeights,
  getBlocksByHeights,
};
