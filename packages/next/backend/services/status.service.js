const { HttpError } = require("../exc");
const { getStatusCollection } = require("../mongo/common");

async function nextPostUid() {
  const statusCol = await getStatusCollection();
  const result = await statusCol.findOneAndUpdate(
    { name: "postUid" },
    { $inc: { value: 1 } },
    { returnDocument: "after", upsert: true }
  );

  if (!result.value) {
    throw new HttpError(500, "Cannot get next post uid");
  }

  return result.value.value.toString();
}

module.exports = {
  nextPostUid,
};
