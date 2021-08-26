const { connectDb } = require("../../utils/db");
const { SupportChains } = require("../../constants");
const { md5 } = require("../../utils");

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
    db = await connectDb(process.env.MONGO_DB_COMMON_NAME || "subsquare-common");
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
  return db?.getCollection(colName);
}

async function lookupUser(lookupProps) {
  const db = await getDb();

  if (!Array.isArray(lookupProps)) {
    return lookupUser([lookupProps]);
  }

  return db.lookupOne(
    {
      from: "user",
      foreignField: "_id",
      map: (item) => ({
        username: item.username,
        emailMd5: md5(item.email.trim().toLocaleLowerCase()),
        addresses: SupportChains.map(chain => ({
          chain,
          address: item[`${chain}Address`]
        })).filter(p => p.address),
      }),
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
}
