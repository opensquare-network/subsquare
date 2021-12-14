const { MongoClient } = require("mongodb");

function getDbName() {
  const dbName = process.env.MONGO_DB_BUSINESS_DATA_NAME;
  if (!dbName) {
    throw new Error("MONGO_DB_BUSINESS_DATA_NAME not set");
  }

  return dbName;
}

const tipCollectionName = "tip";
const motionCollectionName = "motion";

let client = null;
let db = null;

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017";

let tipCol = null;
let motionCol = null;
let treasuryProposalCol = null;
// For democracy posts
let democracyCol = null;
let bountyCol = null;

let techCommMotion = null;

async function initDb() {
  client = await MongoClient.connect(mongoUrl, {
    useUnifiedTopology: true,
  });

  db = client.db(getDbName());
  tipCol = db.collection(tipCollectionName);
  motionCol = db.collection(motionCollectionName);
  treasuryProposalCol = db.collection("treasuryProposal");
  democracyCol = db.collection("democracy");
  bountyCol = db.collection("bounty");

  techCommMotion = db.collection("techCommMotion");

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

async function getDemocracy() {
  await tryInit(democracyCol);
  return democracyCol;
}

async function getBountyCollection() {
  await tryInit(bountyCol);
  return bountyCol;
}

async function getTechCommCollection() {
  await tryInit(techCommMotion);
  return techCommMotion;
}

module.exports = {
  getBusinessTipCollection: getTipCollection,
  getBusinessMotionCollection: getMotionCollection,
  getBusinessTreasuryProposalCollection: getTreasuryProposalCollection,
  getBusinessDemocracy: getDemocracy,
  getBusinessBountyCollection: getBountyCollection,
  getBusinessTechCommMotionCollection: getTechCommCollection,
};
