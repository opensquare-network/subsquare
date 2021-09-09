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
    dbs["karura"] = await connectDb(process.env.MONGO_DB_BUSINESS_DATA_KAR_NAME || "subsquare-business-kar");
    await createIndex(dbs["karura"]);
  }
  if (!dbs["kusama"]) {
    dbs["kusama"] = await connectDb(process.env.MONGO_DB_BUSINESS_DATA_KSM_NAME || "subsquare-business-ksm");
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
  getPostCollection: (chain) => getCollection(chain, "post"),
  getTipCollection: (chain) => getCollection(chain, "tip"),
  getTreasuryProposalCollection: (chain) => getCollection(chain, "treasuryProposal"),
  getBountyCollection: (chain) => getCollection(chain, "bounty"),
  getDemocracyCollection: (chain) => getCollection(chain, "democracy"),
  getCommentCollection: (chain) => getCollection(chain, "comment"),
  getReactionCollection: (chain) => getCollection(chain, "reaction"),
  getStatusCollection: (chain) => getCollection(chain, "status"),
};
