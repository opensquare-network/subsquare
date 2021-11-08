const { MongoClient } = require("mongodb");

function getDbName() {
  const dbName = process.env.MONGO_DB_CHAIN_DATA_NAME;
  if (!dbName) {
    throw new Error("MONGO_DB_CHAIN_DATA_NAME not set");
  }

  return dbName;
}

const statusCollectionName = "status";
const tipCollectionName = "tip";
const motionCollectionName = "motion";
const treasuryProposalCollectionName = "treasuryProposal";

let client = null;
let db = null;

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017";

let statusCol = null;
let tipCol = null;
let motionCol = null;
let techCommMotionCol = null;
let treasuryProposalCol = null;
let democracyPublicProposalCol = null;
let democracyReferendumCol = null;
let democracyExternalCol = null;
let preImageCol = null;
let bountyCol = null;

async function initDb() {
  client = await MongoClient.connect(mongoUrl, {
    useUnifiedTopology: true,
  });

  db = client.db(getDbName());
  statusCol = db.collection(statusCollectionName);
  tipCol = db.collection(tipCollectionName);
  motionCol = db.collection(motionCollectionName);
  techCommMotionCol = db.collection("techCommMotion");
  treasuryProposalCol = db.collection(treasuryProposalCollectionName);
  democracyPublicProposalCol = db.collection("democracyPublicProposal");
  democracyReferendumCol = db.collection("democracyReferendum");
  democracyExternalCol = db.collection("democracyExternal");
  preImageCol = db.collection("democracyPreImage");

  bountyCol = db.collection("bounty");

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

async function getTipCollection() {
  await tryInit(tipCol);
  return tipCol;
}

async function getMotionCollection() {
  await tryInit(motionCol);
  return motionCol;
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

async function getDemocracyExternalCollection() {
  await tryInit(democracyExternalCol);
  return democracyExternalCol;
}

async function getTechCommMotionCollection() {
  await tryInit(techCommMotionCol);
  return techCommMotionCol;
}

async function getDemocracyPreImageCollection() {
  await tryInit(preImageCol);
  return preImageCol;
}

async function getBountyCollection() {
  await tryInit(bountyCol);
  return bountyCol;
}

module.exports = {
  getStatusCollection,
  getTipCollection,
  getMotionCollection,
  getTreasuryProposalCollection,
  getDemocracyPublicProposalCollection,
  getDemocracyReferendumCollection,
  getDemocracyExternalCollection,
  getTechCommMotionCollection,
  getDemocracyPreImageCollection,
  getBountyCollection,
};
