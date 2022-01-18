const { connectDb } = require("../../utils/db");

const defaultDbNames = {
  kusama: "subsquare-business-ksm",
  karura: "subsquare-business-kar",
  khala: "subsquare-business-kha",
  basilisk: "subsquare-business-bsx",
  kabocha: "subsquare-business-kab",
  bifrost: "subsquare-business-bnc",
  acala: "subsquare-business-aca",
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
      process.env.MONGO_DB_BUSINESS_DATA_NAME ||
        defaultDbNames[process.env.CHAIN]
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
  getPostCollection: () => getCollection("post"),
  getTipCollection: () => getCollection("tip"),
  getTreasuryProposalCollection: () => getCollection("treasuryProposal"),
  getBountyCollection: () => getCollection("bounty"),
  getDemocracyCollection: () => getCollection("democracy"),
  getMotionCollection: () => getCollection("motion"),
  getTechCommMotionCollection: () => getCollection("techCommMotion"),
  getFinancialMotionCollection: () => getCollection("financialMotion"),
  getCommentCollection: () => getCollection("comment"),
  getReactionCollection: () => getCollection("reaction"),
  getStatusCollection: () => getCollection("status"),
};
