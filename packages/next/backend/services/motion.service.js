const { ObjectId } = require("mongodb");
const { toUserPublicInfo } = require("../utils/user");
const { getDb: getChainDb, getMotionCollection, getTreasuryProposalCollection } = require("../mongo/chain");
const { getDb: getCommonDb, getUserCollection } = require("../mongo/common");


async function getActiveMotionsOverview() {
  const chain = process.env.CHAIN;
  const motionCol = await getMotionCollection();
  const motions = await motionCol.find(
    {
      "state.state": { $nin: ["Approved", "Disapproved", "Executed"] }
    })
    .sort({ "indexer.blockHeight": -1 })
    .limit(3)
    .toArray();

  const commonDb = await getCommonDb();
  const chainDb = await getChainDb();
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
      from: "treasuryProposal",
      for: motions,
      as: "treasuryProposal",
      localField: "treasuryProposalIndex",
      foreignField: "proposalIndex",
    }),
  ]);

  return motions;
}

async function getMotionsByChain(page, pageSize) {
  const chain = process.env.CHAIN;
  const motionCol = await getMotionCollection();
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

  const commonDb = await getCommonDb();
  const chainDb = await getChainDb();
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
      from: "treasuryProposal",
      for: motions,
      as: "treasuryProposal",
      localField: "treasuryProposalIndex",
      foreignField: "proposalIndex",
    }),
  ]);

  return {
    items: motions,
    total,
    page,
    pageSize,
  };
}

async function getMotionById(postId) {
  const chain = process.env.CHAIN;
  const q = {};
  if (ObjectId.isValid(postId)) {
    q._id = ObjectId(postId);
  } else {
    q.index = parseInt(postId);
  }

  const motionCol = await getMotionCollection();
  const motion = await motionCol.findOne(q);

  if (!motion) {
    throw new HttpError(404, "Motion not found");
  }

  const userCol = await getUserCollection();
  const author = userCol.findOne({ [`${chain}Address`]: motion.proposer });

  const treasuryProposalCol = await getTreasuryProposalCollection();
  const treasuryProposal = await treasuryProposalCol.findOne({ proposalIndex: motion.treasuryProposalIndex });

  return {
    ...motion,
    author,
    treasuryProposal,
  };
}

module.exports =  {
  getMotionsByChain,
  getMotionById,
  getActiveMotionsOverview,
};
