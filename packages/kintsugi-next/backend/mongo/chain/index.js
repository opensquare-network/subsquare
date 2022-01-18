const { connectDb } = require("../../utils/db");

const defaultDbNames = {
  kintsugi: "subsquare-kint",
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
  getTreasuryProposalCollection: () => getCollection("treasuryProposal"),
  getTechCommMotionCollection: () => getCollection("techCommMotion"),
  getPublicProposalCollection: () => getCollection("democracyPublicProposal"),
  getReferendumCollection: () => getCollection("democracyReferendum"),
  getPreImageCollection: () => getCollection("democracyPreImage"),
};
