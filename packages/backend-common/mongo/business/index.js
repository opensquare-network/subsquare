const { connectDb } = require("../../utils/db");

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
    if (!process.env.MONGO_DB_BUSINESS_DATA_NAME) {
      console.error(`Environment variable MONGO_DB_BUSINESS_DATA_NAME is not defined`);
      process.exit();
    }

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
  getCollection,
  getStatusCollection: () => getCollection("status"),
  getPostCollection: () => getCollection("post"),
  getCommentCollection: () => getCollection("comment"),
  getReactionCollection: () => getCollection("reaction"),
};
