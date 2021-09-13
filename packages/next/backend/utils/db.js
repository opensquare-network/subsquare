const { MongoClient } = require("mongodb");
const _ = require("lodash");

function getField(data, fieldName) {
  return fieldName.split(".").reduce((data, field) => data[field], data);
}

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

async function connectDb(dbName) {
  const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017";

  const client = await MongoClient.connect(mongoUrl, {
    useUnifiedTopology: true,
  });

  const db = client.db(dbName);

  const collections = {};

  function getCollection(colName) {
    if (!collections[colName]) {
      collections[colName] = db.collection(colName)
    }
    return collections[colName];
  }

  async function lookupOne({ from, foreignField, projection, map }, lookupProps) {
    if (lookupProps === undefined) {
      const { for: for_, localField, as } =  arguments[0];
      return lookupOne(
        { from, foreignField, projection, map },
        [{ for: for_, localField, as }]
      );
    }

    const query = new DeferredCall(async (keys) => {
      const col = getCollection(from);
      const items = await col.find(
        { [foreignField]: { $in: keys } },
        projection ? { projection: {...projection, [foreignField]: 1 } } : {}
      ).toArray();
      const itemsMap = new Map(items.map(item => [getField(item, foreignField).toString(), map ? map(item) : item]));
      return itemsMap;
    });

    let itemsMap = new Set();

    await Promise.all(
      lookupProps.map(async ({ for: for_, localField, as }) => {
        const records = Array.isArray(for_) ? for_ : [for_];
        const vals = records.map(item => getField(item, localField)).filter(val => val !== null && val !== undefined);

        itemsMap = await query.addParams(vals);

        records.forEach(item => {
          const relatedItem = itemsMap.get(getField(item, localField)?.toString());
          if (relatedItem) {
            item[as ?? localField] = relatedItem;
          } else {
            item[as ?? localField] = null;
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
    const vals = Array.from(new Set(records.map(item => getField(item, localField))));
    const col = getCollection(from);
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
      const relatedItem = countsMap.get(getField(item, localField)?.toString());
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
    const vals = Array.from(new Set(records.map(item => getField(item, localField)).filter(val => val !== null && val !== undefined)));
    const col = getCollection(from);
    const items = await col.aggregate([
      {
        $match: { [foreignField]: { $in: vals } }
      },
      ...(
        projection ? [
          {
            $project: {...projection, [foreignField]: 1 }
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
      const relatedItem = itemsMap.get(getField(item, localField)?.toString());
      if (relatedItem) {
        item[as] = relatedItem;
      } else {
        item[as] = [];
      }
    });

    return _.flatten(Array.from(itemsMap.values()));
  }

  async function compoundLookupOne({ from, compoundForeignFields, projection, map, for: for_, compoundLocalFields, as }) {
    const records = Array.isArray(for_) ? for_ : [for_];
    const vals = records.map(item => compoundLocalFields.map(localField => getField(item, localField)));

    const q = [
      { $limit: 1 },
      {
        $project: {
          _id: 0,
          keys: vals.map(val => Object.fromEntries(val.map((v, i) => ["field" + i, v]))),
        }
      },
      { $unwind: "$keys" },
      {
        $lookup: {
          from,
          let: Object.fromEntries(compoundForeignFields.map(
            (foreignField, i) => ["field" + i, "$keys.field" + i]
          )),
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: compoundForeignFields.map(
                    (foreignField, i) => ({ $eq: ["$" + foreignField, "$$field" + i] })
                  ),
                }
              }
            },
            ...(projection ? [{ $project: projection }] : []),
          ],
          as: "result",
        }
      },
      {
        $addFields: {
          result: { $first: "$result" }
        }
      }
    ];

    const col = getCollection(from);
    const items = await col.aggregate(q).toArray();
    const itemsMap = new Map(items.map(item =>
      [
        JSON.stringify(Object.values(item.keys)),
        map && item.result ? map(item.result) : item.result,
      ]
    ));

    records.forEach(item => {
      const relatedItem = itemsMap.get(JSON.stringify(compoundLocalFields.map(localField => getField(item, localField))));
      if (relatedItem) {
        item[as] = relatedItem;
      } else {
        item[as] = null;
      }
    });

    return Array.from(itemsMap.values());
  }

  return {
    getCollection,
    lookupOne,
    lookupMany,
    lookupCount,
    compoundLookupOne,
  };
}

module.exports = {
  connectDb,
};
