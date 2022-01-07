const { connectDb } = require("../../utils/db");

const defaultDbNames = {
  kusama: "subsquare-ksm",
  karura: "subsquare-kar",
  khala: "subsquare-kha",
  basilisk: "subsquare-bsx",
  kabocha: "subsquare-kab",
  bifrost: "subsquare-bnc",
};

let db = null;

async function getDb() {
  if (!db) {
    await initDb();
  }
  return db;
}

async function createIndex(db) {
  // TODO: create indexes
}

async function initDb() {
  if (!db) {
    db = await connectDb(
      process.env.MONGO_DB_CHAIN_DATA_NAME || defaultDbNames[process.env.CHAIN]
    );
    await createIndex(db);
  }
}

async function getCollection(colName) {
  const db = await getDb();
  return db.getCollection(colName);
}

module.exports = {
  initDb,
  getDb,
  getStatusCollection: () => getCollection("status"),
  getTipCollection: () => getCollection("tip"),
  getTreasuryProposalCollection: () => getCollection("treasuryProposal"),
  getBountyCollection: () => getCollection("bounty"),
  getMotionCollection: () => getCollection("motion"),
  getTechCommMotionCollection: () => getCollection("techCommMotion"),
  getFinancialMotionCollection: () => getCollection("financialMotion"),
  getPublicProposalCollection: () => getCollection("democracyPublicProposal"),
  getReferendumCollection: () => getCollection("democracyReferendum"),
  getExternalCollection: () => getCollection("democracyExternal"),
  getPreImageCollection: () => getCollection("democracyPreImage"),
};
