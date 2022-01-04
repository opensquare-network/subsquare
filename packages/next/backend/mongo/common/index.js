const { connectDb } = require("../../utils/db");
const { toUserPublicInfo } = require("../../utils/user");

let db = null;

async function createIndex(db) {
  const userCol = db.getCollection("user");
  userCol.createIndex({ username: 1 }, { unique: true });
  userCol.createIndex({ email: 1 }, { unique: true });

  const attemptCol = db.getCollection("attempt");
  attemptCol.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 });
}

async function initDb() {
  if (!db) {
    db = await connectDb(
      process.env.MONGO_DB_COMMON_NAME || "subsquare-common",
      process.env.MONGO_COMMON_URL
    );
    await createIndex(db);
  }
}

async function getDb() {
  if (!db) {
    await initDb();
  }
  return db;
}

async function getCollection(colName) {
  const db = await getDb();
  return db.getCollection(colName);
}

async function lookupUser(lookupProps) {
  if (!Array.isArray(lookupProps)) {
    return lookupUser([lookupProps]);
  }

  const db = await getDb();
  return db.lookupOne(
    {
      from: "user",
      foreignField: "_id",
      map: toUserPublicInfo,
    },
    lookupProps
  );
}

module.exports = {
  initDb,
  getDb,
  lookupUser,
  getUserCollection: () => getCollection("user"),
  getAttemptCollection: () => getCollection("attempt"),
};
