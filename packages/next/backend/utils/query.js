const { getDb } = require("../mongo/common");

async function lookupOne(result, { from, localField, foreignField, projection }) {
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

async function lookupCount(result, { from, localField, foreignField, as }) {
  if (result === null) {
    return [];
  }

  const records = Array.isArray(result) ? result : [result];
  const vals = records.map(item => item[localField]);
  const db = await getDb();
  const col = db.collection(from);
  const items = await col.aggregate([
    {
      $match: { [foreignField]: { $in: vals } }
    },
    {
      $group: {
        _id: "$" + foreignField,
        count: { $sum: 1 }
      }
    }
  ]).toArray();
  const countsMap = new Map(items.map(item => [item._id.toString(), item]));

  records.forEach(item => {
    const relatedItem = countsMap.get(item[localField].toString());
    if (relatedItem) {
      item[as] = relatedItem.count;
    } else {
      item[as] = 0;
    }
  });
}

module.exports = {
  lookupOne,
  lookupCount,
};
