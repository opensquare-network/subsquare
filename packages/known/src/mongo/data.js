const { MongoClient } = require("mongodb");
const {
  env: { isKarura },
} = require("@subsquare/scan-common");

function getDbName() {
  return process.env.MONGO_DB_NAME || "business-chain-table";
}

let client = null;
let db = null;

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017";

let tipCol = null;
let motionCol = null;
let techCommMotionCol = null;
let treasuryProposalCol = null;
let democracyPublicProposalCol = null;
let democracyReferendumCol = null;
let democracyExternalCol = null;
let preImageCol = null;
let bountyCol = null;
let financialMotionCol = null;

async function initDb() {
  client = await MongoClient.connect(mongoUrl, {
    useUnifiedTopology: true,
  });

  db = client.db(getDbName());
  tipCol = db.collection("tip");
  motionCol = db.collection("motion");
  techCommMotionCol = db.collection("techCommMotion");
  treasuryProposalCol = db.collection("treasuryProposal");
  democracyPublicProposalCol = db.collection("democracyPublicProposal");
  democracyReferendumCol = db.collection("democracyReferendum");
  democracyExternalCol = db.collection("democracyExternal");
  preImageCol = db.collection("democracyPreImage");

  bountyCol = db.collection("bounty");
  if (isKarura()) {
    financialMotionCol = db.collection("financialMotion");
  }
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

async function closeDataDbClient() {
  await client.close();
}

async function getFinancialMotionCollection() {
  await tryInit(financialMotionCol);
  return financialMotionCol;
}

module.exports = {
  getTipCollection,
  getMotionCollection,
  getTreasuryProposalCollection,
  getDemocracyPublicProposalCollection,
  getDemocracyReferendumCollection,
  getDemocracyExternalCollection,
  getTechCommMotionCollection,
  getDemocracyPreImageCollection,
  getBountyCollection,
  closeDataDbClient,
  ...(isKarura() ? { getFinancialMotionCollection } : {}),
};
