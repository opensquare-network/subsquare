const { MongoClient } = require("mongodb");

function getDbName() {
  const dbName = process.env.MONGO_DB_BUSINESS_DATA_NAME;
  if (!dbName) {
    throw new Error("MONGO_DB_BUSINESS_DATA_NAME not set");
  }

  return dbName;
}

let client = null;
let db = null;

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017";

let treasuryProposalCol = null;
// For democracy posts
let democracyCol = null;
let techCommMotion = null;

async function initDb() {
  client = await MongoClient.connect(mongoUrl, {
    useUnifiedTopology: true,
  });

  db = client.db(getDbName());
  treasuryProposalCol = db.collection("treasuryProposal");
  democracyCol = db.collection("democracy");
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

async function getTreasuryProposalCollection() {
  await tryInit(treasuryProposalCol);
  return treasuryProposalCol;
}

async function getDemocracy() {
  await tryInit(democracyCol);
  return democracyCol;
}

async function getTechCommCollection() {
  await tryInit(techCommMotion);
  return techCommMotion;
}

module.exports = {
  getBusinessTreasuryProposalCollection: getTreasuryProposalCollection,
  getBusinessDemocracy: getDemocracy,
  getBusinessTechCommMotionCollection: getTechCommCollection,
};
