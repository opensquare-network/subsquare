const { getDb } = require("../mongo/common");

async function populateOnlyOne(result, { from, localField, foreignField, projection }) {
  if (result === null) {
    return [];
  }

  const records = Array.isArray(result) ? result : [result];
  const vals = records.map(item => item[localField]);
  const db = await getDb();
  const col = db.collection(from);
  const items = await col.find({ [foreignField]: { $in: vals } }, { projection }).toArray();
  const itemsMap = new Map(items.map(item => [item[foreignField].toString(), item]));

  records.forEach(item => {
    const relatedItem = itemsMap.get(item[localField].toString());
    if (relatedItem) {
      item[localField] = relatedItem;
    }
  });
  return items;
}

module.exports = {
  populateOnlyOne,
};
