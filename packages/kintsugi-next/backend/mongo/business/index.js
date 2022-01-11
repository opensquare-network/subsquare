const { connectDb } = require("../../utils/db");

const defaultDbNames = {
  kintsugi: "subsquare-business-kint",
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
  getTreasuryProposalCollection: () => getCollection("treasuryProposal"),
  getDemocracyCollection: () => getCollection("democracy"),
  getTechCommMotionCollection: () => getCollection("techCommMotion"),
  getCommentCollection: () => getCollection("comment"),
  getReactionCollection: () => getCollection("reaction"),
  getStatusCollection: () => getCollection("status"),
};
