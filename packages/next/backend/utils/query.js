const _ = require("lodash");
const { getDb } = require("../mongo/common");
const { SupportChains } = require("../constants");
const { md5 } = require("../utils");

class DeferredCall {
  constructor(callback) {
    this.promise = new Promise(resolve => {
      process.nextTick(() => callback(this.params || []).then(resolve));
    });
  }

  addParams(params) {
    this.params = this.params || [];
    this.params.push(...params);
    return this.promise;
  }
}

function lookupUser(lookupProps) {
  if (!Array.isArray(lookupProps)) {
    return lookupUser([lookupProps]);
  }

  return lookupOne(
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

async function lookupOne({ from, foreignField, projection, map }, lookupProps) {
  if (lookupProps === undefined) {
    const { for: for_, localField } =  arguments[0];
    return lookupOne(
      { from, foreignField, projection, map },
      [{ for: for_, localField }]
    );
  }

  const query = new DeferredCall(async (keys) => {
    const db = await getDb();
    const col = db.collection(from);
    const items = await col.find({ [foreignField]: { $in: keys } }, { projection }).toArray();
    const itemsMap = new Map(items.map(item => [item[foreignField].toString(), map ? map(item) : item]));
    return itemsMap;
  });

  let itemsMap = new Set();

  await Promise.all(
    lookupProps.map(async ({ for: for_, localField }) => {
      const records = Array.isArray(for_) ? for_ : [for_];
      const vals = records.map(item => item[localField]);

      itemsMap = await query.addParams(vals);

      records.forEach(item => {
        const relatedItem = itemsMap.get(item[localField].toString());
        if (relatedItem) {
          item[localField] = relatedItem;
        } else {
          item[localField] = null;
        }
      });
    })
  );

  return Array.from(itemsMap.values());
}

async function lookupCount({ from, for: for_, as, localField, foreignField }) {
  if (for_ === null) {
    return;
  }

  const records = Array.isArray(for_) ? for_ : [for_];
  const vals = Array.from(new Set(records.map(item => item[localField])));
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

async function lookupMany({ from, for: for_, projection, as, localField, foreignField, map }) {
  if (for_ === null) {
    return [];
  }

  const records = Array.isArray(for_) ? for_ : [for_];
  const vals = Array.from(new Set(records.map(item => item[localField])));
  const db = await getDb();
  const col = db.collection(from);
  const items = await col.aggregate([
    {
      $match: { [foreignField]: { $in: vals } }
    },
    ...(
      projection ? [
        {
          $project: projection
        }
      ] : []
    ),
    {
      $group: {
        _id: "$" + foreignField,
        values: { $push: "$$ROOT" }
      }
    },
  ]).toArray();
  const itemsMap = new Map(items.map(item => [item._id.toString(), map ? item.values.map(map) : item.values]));

  records.forEach(item => {
    const relatedItem = itemsMap.get(item[localField].toString());
    if (relatedItem) {
      item[as] = relatedItem;
    } else {
      item[as] = [];
    }
  });

  return _.flatten(Array.from(itemsMap.values()));
}

module.exports = {
  lookupOne,
  lookupMany,
  lookupCount,
  lookupUser,
};
