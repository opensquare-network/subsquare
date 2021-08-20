const { MongoClient } = require("mongodb");

const dbName = process.env.MONGO_DB_COMMON_NAME || "subsquare-common";

const userCollectionName = "user";
const attemptCollectionName = "attempt";
const postCollectionName = "post";
const commentCollectionName = "comment";
const statusCollectionName = "status";
const reactionCollectionName = "reaction";

let client = null;
let db = null;

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017";
let userCol = null;
let attemptCol = null;
let postCol = null;
let commentCol = null;
let statusCol = null;
let reactionCol = null;

async function initDb() {
  client = await MongoClient.connect(mongoUrl, {
    useUnifiedTopology: true,
  });

  db = client.db(dbName);
  userCol = db.collection(userCollectionName);
  attemptCol = db.collection(attemptCollectionName);
  postCol = db.collection(postCollectionName);
  commentCol = db.collection(commentCollectionName);
  statusCol = db.collection(statusCollectionName);
  reactionCol = db.collection(reactionCollectionName);

  await _createIndexes();
}

async function _createIndexes() {
  if (!db) {
    console.error("Please call initDb first");
    process.exit(1);
  }

  userCol.createIndex({ username: 1 }, { unique: true });
  userCol.createIndex({ email: 1 }, { unique: true });

  attemptCol.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 });

}

async function tryInit(col) {
  if (!col) {
    await initDb();
  }
}

function withTransaction(fn, options) {
  return client.withSession((session) => {
    return session.withTransaction(fn, options);
  });
}

async function getUserCollection() {
  await tryInit(userCol);
  return userCol;
}

async function getAttemptCollection() {
  await tryInit(attemptCol);
  return attemptCol;
}

async function getPostCollection() {
  await tryInit(postCol);
  return postCol;
}

async function getCommentCollection() {
  await tryInit(commentCol);
  return commentCol;
}

async function getStatusCollection() {
  await tryInit(statusCol);
  return statusCol;
}

async function getReactionCollection() {
  await tryInit(reactionCol);
  return reactionCol;
}

async function getDb() {
  if (!db) {
    await initDb();
  }
  return db
}

module.exports = {
  initDb,
  getDb,
  withTransaction,
  getUserCollection,
  getAttemptCollection,
  getPostCollection,
  getCommentCollection,
  getStatusCollection,
  getReactionCollection,
};
