const { MongoClient } = require("mongodb");
const { currentChain, CHAINS } = require("../env");

function getDbName() {
  const chain = currentChain();

  if (CHAINS.KARURA === chain) {
    return (
      process.env.MONGO_DB_BUSINESS_DATA_KAR_NAME || "subsquare-business-kar"
    );
  } else if (CHAINS.KHALA === chain) {
    return (
      process.env.MONGO_DB_BUSINESS_DATA_KHA_NAME || "subsquare-business-kha"
    );
  } else if (CHAINS.KUSAMA === chain) {
    return (
      process.env.MONGO_DB_BUSINESS_DATA_KSM_NAME || "subsquare-business-ksm"
    );
  } else if (CHAINS.POLKADOT === chain) {
    return (
      process.env.MONGO_DB_BUSINESS_DATA_DOT_NAME || "subsquare-business-dot"
    );
  } else {
    return (
      process.env.MONGO_DB_BUSINESS_DATA_KAR_NAME || "subsquare-business-kar"
    );
  }
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

module.exports = {
  getBusinessTipCollection: getTipCollection,
  getBusinessMotionCollection: getMotionCollection,
  getBusinessTreasuryProposalCollection: getTreasuryProposalCollection,
  getBusinessDemocracy: getDemocracy,
  getBusinessBountyCollection: getBountyCollection,
};
