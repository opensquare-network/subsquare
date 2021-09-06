const { getBusinessDemocracyReferendumCollection } = require("../../business");

async function insertReferendumPost(referendumObj) {
  const col = await getBusinessDemocracyReferendumCollection();
  const maybeInDb = await col.findOne({
    referendumIndex: referendumObj.referendumIndex,
  });
  if (maybeInDb) {
    return;
  }

  await col.insertOne({
    referendumIndex: referendumObj.referendumIndex,
  });
}

module.exports = {
  insertDemocracyReferendumPost: insertReferendumPost,
};
