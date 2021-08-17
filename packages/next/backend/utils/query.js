const { getDb } = require("../mongo/common");
const { SupportChains } = require("../constants");
const { md5 } = require("../utils");


function lookupUser(result, { localField }) {
  return lookupOne(result, {
    from: "user",
    localField,
    foreignField: "_id",
    map: (item) => ({
      username: item.username,
      emailMd5: md5(item.email.trim().toLocaleLowerCase()),
      addresses: SupportChains.map(chain => ({
        chain,
        address: item[`${chain}Address`]
      })).filter(p => p.address),
    }),
  });
}

async function lookupOne(result, { from, localField, foreignField, projection, map }) {
  if (result === null) {
    return [];
  }

  const records = Array.isArray(result) ? result : [result];
  const vals = records.map(item => item[localField]);
  const db = await getDb();
  const col = db.collection(from);
  const items = await col.find({ [foreignField]: { $in: vals } }, { projection }).toArray();
  const itemsMap = new Map(items.map(item => [item[foreignField].toString(), map ? map(item) : item]));

  records.forEach(item => {
    const relatedItem = itemsMap.get(item[localField].toString());
    if (relatedItem) {
      item[localField] = relatedItem;
    } else {
      item[localField] = null;
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
  lookupUser,
};
