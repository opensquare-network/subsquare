const { toUserPublicInfo } = require("../utils/user");
const { getMotionCollection } = require("../mongo/chain");
const { getDb: getBusinessDb, getTreasuryProposalCollection } = require("../mongo/business");
const { getDb: getCommonDb, getUserCollection } = require("../mongo/common");

async function getMotionsByChain(chain, page, pageSize) {
  const motionCol = await getMotionCollection(chain);
  const total = await motionCol.countDocuments();

  if (page === "last") {
    const totalPages = Math.ceil(total / pageSize);
    page = totalPages;
  }

  const motions = await motionCol.find({})
    .sort({ lastActivityAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .toArray();

    const commonDb = await getCommonDb(chain);
    const businessDb = await getBusinessDb(chain);
    await Promise.all([
      commonDb.lookupOne({
        from: "user",
        for: motions,
        as: "author",
        localField: "proposer",
        foreignField: `${chain}Address`,
        map: toUserPublicInfo,
      }),
      businessDb.lookupOne({
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

async function getMotionById(chain, postId) {
  const q = {};
  if (ObjectId.isValid(postId)) {
    q._id = ObjectId(postId);
  } else {
    q.motionIndex = parseInt(postId);
  }

  const motionCol = await getMotionCollection(chain);
  const motion = await motionCol.findOne(q);

  if (!motion) {
    throw new HttpError(404, "Motion not found");
  }

  const userCol = await getUserCollection();
  const author = userCol.findOne({ [`${chain}Address`]: motion.proposer });

  const treasuryProposalCol = await getTreasuryProposalCollection(chain);
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
};
