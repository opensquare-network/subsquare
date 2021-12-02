const { ObjectId } = require("mongodb");
const { toUserPublicInfo } = require("../utils/user");
const {
  getDb: getChainDb,
  getMotionCollection: getChainMotionCollection,
  getTreasuryProposalCollection: getChainTreasuryProposalCollection
} = require("../mongo/chain");
const { getDb: getCommonDb, getUserCollection } = require("../mongo/common");
const { getDb: getBusinessDb, getMotionCollection } = require("../mongo/business");

async function updatePost(postId, title, content, contentType, author) {
  const chain = process.env.CHAIN;
  const postObjId = ObjectId(postId);
  const postCol = await getMotionCollection();
  const post = await postCol.findOne({ _id: postObjId });
  if (!post) {
    throw new HttpError(404, "Post does not exists");
  }

  const chainMotionCol = await getChainMotionCollection();
  const chainMotion = await chainMotionCol.findOne({
    proposalIndex: post.proposalIndex,
  });

  if (!chainMotion) {
    throw new HttpError(403, "On-chain data is not found");
  }

  if (!chainMotion.authors.includes(author[`${chain}Address`])) {
    throw new HttpError(403, "You cannot edit");
  }

  if (title.length > PostTitleLengthLimitation) {
    throw new HttpError(400, {
      title: ["Title must be no more than %d characters"],
    });
  }

  const now = new Date();

  const result = await postCol.updateOne(
    { _id: postObjId },
    {
      $set: {
        title,
        content: contentType === ContentType.Html ? safeHtml(content) : content,
        contentType,
        contentVersion: post.contentVersion ?? "2",
        updatedAt: now,
        lastActivityAt: now,
      },
    }
  );

  if (!result.acknowledged) {
    throw new HttpError(500, "Failed to update post");
  }

  return true;
}

async function getActiveMotionsOverview() {
  const chain = process.env.CHAIN;
  const motionCol = await getChainMotionCollection();
  const motions = await motionCol.find(
    {
      "state.state": { $nin: ["Approved", "Disapproved", "Executed"] }
    })
    .sort({ "indexer.blockHeight": -1 })
    .limit(3)
    .toArray();

  const commonDb = await getCommonDb();
  const businessDb = await getBusinessDb();
  const chainDb = await getChainDb();

  const [posts, ] = await Promise.all([
    businessDb.lookupOne({
      from: "motion",
      for: motions,
      as: "post",
      localField: "index",
      foreignField: "motionIndex",
    }),
    chainDb.lookupOne({
      from: "treasuryProposal",
      for: motions,
      as: "treasuryProposal",
      localField: "treasuryProposalIndex",
      foreignField: "proposalIndex",
    }),
  ]);

  await Promise.all([
    commonDb.lookupOne({
      from: "user",
      for: posts,
      as: "author",
      localField: "proposer",
      foreignField: `${chain}Address`,
      map: toUserPublicInfo,
    }),
    businessDb.lookupCount({
      from: "comment",
      for: posts,
      as: "commentsCount",
      localField: "_id",
      foreignField: "motion",
    }),
  ]);

  return motions.map((motion) => {
    const post = motion.post;
    motion.post = undefined;
    post.onchainData = motion;
    post.state = motion.state?.state;
    return post;
  });
}

async function getMotionsByChain(page, pageSize) {
  const chain = process.env.CHAIN;
  const postCol = await getMotionCollection();
  const total = await postCol.countDocuments();

  if (page === "last") {
    const totalPages = Math.ceil(total / pageSize);
    page = Math.max(totalPages, 1);
  }

  const posts = await postCol
    .find({})
    .sort({ lastActivityAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .toArray();

  const commonDb = await getCommonDb();
  const businessDb = await getBusinessDb();
  const chainDb = await getChainDb();
  const [, , chainMotions] = await Promise.all([
    commonDb.lookupOne({
      from: "user",
      for: posts,
      as: "author",
      localField: "proposer",
      foreignField: `${chain}Address`,
      map: toUserPublicInfo,
    }),
    businessDb.lookupCount({
      from: "comment",
      for: posts,
      as: "commentsCount",
      localField: "_id",
      foreignField: "motion",
    }),
    chainDb.lookupOne({
      from: "motion",
      for: posts,
      as: "onchainData",
      localField: "motionIndex",
      foreignField: "index",
      projection: { timeline: 0 },
    }),
  ]);

  await chainDb.lookupOne({
    from: "treasuryProposal",
    for: chainMotions,
    as: "treasuryProposal",
    localField: "treasuryProposalIndex",
    foreignField: "proposalIndex",
  });

  return {
    items: posts.map((p) => ({
      ...p,
      state: p.onchainData?.state?.state,
    })),
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

  const postCol = await getMotionCollection();
  const post = await postCol.findOne(q);

  if (!post) {
    throw new HttpError(404, "Post not found");
  }

  const commonDb = await getCommonDb();
  const businessDb = await getBusinessDb();
  const chainMotionCol = await getChainMotionCollection();
  const [, reactions, motionData] = await Promise.all([
    commonDb.lookupOne({
      from: "user",
      for: post,
      as: "author",
      localField: "proposer",
      foreignField: `${chain}Address`,
      map: toUserPublicInfo,
    }),
    businessDb.lookupMany({
      from: "reaction",
      for: post,
      as: "reactions",
      localField: "_id",
      foreignField: "motion",
    }),
    chainMotionCol.findOne({ index: post.motionIndex }),
  ]);

  const treasuryProposalCol = await getChainTreasuryProposalCollection();

  const [, treasuryProposal] = await Promise.all([
    lookupUser({ for: reactions, localField: "user" }),
    treasuryProposalCol.findOne({ proposalIndex: motionData.treasuryProposalIndex })
  ])


  return {
    ...post,
    onchainData: {
      ...motionData,
      treasuryProposal,
    },
  };
}

module.exports =  {
  updatePost,
  getMotionsByChain,
  getMotionById,
  getActiveMotionsOverview,
};
