const { connectDb } = require("../../utils/db");

const dbs = {};

async function getDb(chain) {
  if (!dbs[chain]) {
    await initDb();
  }
  return dbs[chain];
}

async function createIndex(db) {
  // TODO: create indexes
}

async function initDb() {
  if (!dbs["karura"]) {
    dbs["karura"] = await connectDb(process.env.MONGO_DB_CHAIN_DATA_KAR_NAME || "subsquare-kar");
    await createIndex(dbs["karura"]);
  }
  if (!dbs["kusama"]) {
    dbs["kusama"] = await connectDb(process.env.MONGO_DB_CHAIN_DATA_KSM_NAME || "subsquare-ksm");
    await createIndex(dbs["kusama"]);
  }
}

async function getCollection(chain, colName) {
  const db = await getDb(chain);
  return db.getCollection(colName);
}

module.exports = {
  initDb,
  getDb,
  getTipCollection: (chain) => getCollection(chain, "tip"),
  getTreasuryProposalCollection: (chain) => getCollection(chain, "treasuryProposal"),
  getBountyCollection: (chain) => getCollection(chain, "bounty"),
  getMotionCollection: (chain) => getCollection(chain, "motion"),
};
