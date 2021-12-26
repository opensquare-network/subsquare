const { MongoClient } = require("mongodb");

function getDbName() {
  const dbName = process.env.MONGO_DB_CHAIN_DATA_NAME;
  if (!dbName) {
    throw new Error("MONGO_DB_CHAIN_DATA_NAME not set");
  }

  return dbName;
}

const statusCollectionName = "status";
const treasuryProposalCollectionName = "treasuryProposal";

let client = null;
let db = null;

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017";

let statusCol = null;
let techCommMotionCol = null;
let treasuryProposalCol = null;
let democracyPublicProposalCol = null;
let democracyReferendumCol = null;
let preImageCol = null;

async function initDb() {
  client = await MongoClient.connect(mongoUrl, {
    useUnifiedTopology: true,
  });

  db = client.db(getDbName());
  statusCol = db.collection(statusCollectionName);
  techCommMotionCol = db.collection("techCommMotion");
  treasuryProposalCol = db.collection(treasuryProposalCollectionName);
  democracyPublicProposalCol = db.collection("democracyPublicProposal");
  democracyReferendumCol = db.collection("democracyReferendum");
  preImageCol = db.collection("democracyPreImage");

  await _createIndexes();
}

async function _createIndexes() {
  if (!db) {
    console.error("Please call initDb first");
    process.exit(1);
  }

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

async function getTreasuryProposalCollection() {
  await tryInit(treasuryProposalCol);
  return treasuryProposalCol;
}

async function getDemocracyPublicProposalCollection() {
  await tryInit(democracyPublicProposalCol);
  return democracyPublicProposalCol;
}

async function getDemocracyReferendumCollection() {
  await tryInit(democracyReferendumCol);
  return democracyReferendumCol;
}

async function getTechCommMotionCollection() {
  await tryInit(techCommMotionCol);
  return techCommMotionCol;
}

async function getDemocracyPreImageCollection() {
  await tryInit(preImageCol);
  return preImageCol;
}

module.exports = {
  initDb,
  getStatusCollection,
  getTreasuryProposalCollection,
  getDemocracyPublicProposalCollection,
  getDemocracyReferendumCollection,
  getTechCommMotionCollection,
  getDemocracyPreImageCollection,
};
