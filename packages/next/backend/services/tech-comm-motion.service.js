const { ObjectId } = require("mongodb");
const { toUserPublicInfo } = require("../utils/user");
const { getDb: getChainDb, getTechCommMotionCollection, getExternalCollection } = require("../mongo/chain");
const { getDb: getCommonDb, getUserCollection } = require("../mongo/common");


async function getActiveMotionsOverview(chain) {
  const motionCol = await getTechCommMotionCollection(chain);
  const motions = await motionCol.find(
    {
      "state.state": { $nin: ["Approved", "Disapproved", "Executed"] }
    })
    .sort({ "indexer.blockHeight": -1 })
    .limit(3)
    .toArray();

  const commonDb = await getCommonDb(chain);
  const chainDb = await getChainDb(chain);
  await Promise.all([
    commonDb.lookupOne({
      from: "user",
      for: motions,
      as: "author",
      localField: "proposer",
      foreignField: `${chain}Address`,
      map: toUserPublicInfo,
    }),
    chainDb.lookupOne({
      from: "democracyExternal",
      for: motions,
      as: "democracyExternal",
      localField: "proposalHash",
      foreignField: "proposalHash",
    }),
  ]);

  return motions;
}

async function getMotionsByChain(chain, page, pageSize) {
  const motionCol = await getTechCommMotionCollection(chain);
  const total = await motionCol.countDocuments();

  if (page === "last") {
    const totalPages = Math.ceil(total / pageSize);
    page = Math.max(totalPages, 1);
  }

  const motions = await motionCol.find({}, { projection: { timeline: 0 } })
    .sort({ index: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .toArray();

    const commonDb = await getCommonDb(chain);
    const chainDb = await getChainDb(chain);
    await Promise.all([
      commonDb.lookupOne({
        from: "user",
        for: motions,
        as: "author",
        localField: "proposer",
        foreignField: `${chain}Address`,
        map: toUserPublicInfo,
      }),
      chainDb.lookupOne({
        from: "democracyExternal",
        for: motions,
        as: "democracyExternal",
        localField: "proposalHash",
        foreignField: "proposalHash",
      }),
    ]);

  return {
    items: motions,
    total,
    page,
    pageSize,
  };
}

async function getMotionById(chain, postId) {
  const q = {};
  if (ObjectId.isValid(postId)) {
    q._id = ObjectId(postId);
  } else {
    q.index = parseInt(postId);
  }

  const motionCol = await getTechCommMotionCollection(chain);
  const motion = await motionCol.findOne(q);

  if (!motion) {
    throw new HttpError(404, "Motion not found");
  }

  const userCol = await getUserCollection();
  const author = userCol.findOne({ [`${chain}Address`]: motion.proposer });

  const externalCol = await getExternalCollection(chain);
  const democracyExternal = await externalCol.findOne({ proposalHash: motion.proposalHash });

  return {
    ...motion,
    author,
    democracyExternal,
  };
}

module.exports =  {
  getMotionsByChain,
  getMotionById,
  getActiveMotionsOverview,
};
