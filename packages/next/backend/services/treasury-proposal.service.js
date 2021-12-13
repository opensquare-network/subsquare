const { ObjectId } = require("mongodb");
const { safeHtml } = require("../utils/post");
const { PostTitleLengthLimitation, Day } = require("../constants");
const {
  getDb: getBusinessDb,
  getTreasuryProposalCollection,
} = require("../mongo/business");
const {
  getDb: getChainDb,
  getTreasuryProposalCollection: getChainTreasuryProposalCollection,
  getMotionCollection,
} = require("../mongo/chain");
const { getDb: getCommonDb, lookupUser } = require("../mongo/common");
const { HttpError } = require("../exc");
const { ContentType } = require("../constants");
const { toUserPublicInfo } = require("../utils/user");

async function updatePost(postId, title, content, contentType, author) {
  const chain = process.env.CHAIN;
  const postObjId = ObjectId(postId);
  const postCol = await getTreasuryProposalCollection();
  const post = await postCol.findOne({ _id: postObjId });
  if (!post) {
    throw new HttpError(404, "Post does not exists");
  }

  const chainProposalCol = await getChainTreasuryProposalCollection();
  const chainProposal = await chainProposalCol.findOne({
    proposalIndex: post.proposalIndex,
  });

  if (!chainProposal) {
    throw new HttpError(403, "On-chain data is not found");
  }

  if (!chainProposal.authors.includes(author[`${chain}Address`])) {
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

async function getActivePostsOverview() {
  const chain = process.env.CHAIN;

  const treasuryProposalCol = await getTreasuryProposalCollection();
  const activePosts = await treasuryProposalCol
    .distinct(
      "proposalIndex",
      {
        lastActivityAt: { $gte: new Date(Date.now() - 7 * Day) },
      }
    );

  const chainProposalCol = await getChainTreasuryProposalCollection();
  const proposals = await chainProposalCol
    .find(
      {
        "state.state": { $nin: ["Awarded", "Approved", "Rejected"] },
        proposalIndex: { $in: activePosts },
      },
      {
        projection: { timeline: 0 },
      }
    )
    .sort({ "indexer.blockHeight": -1 })
    .limit(3)
    .toArray();

  const commonDb = await getCommonDb();
  const businessDb = await getBusinessDb();
  const posts = await businessDb.lookupOne({
    from: "treasuryProposal",
    for: proposals,
    as: "post",
    localField: "proposalIndex",
    foreignField: "proposalIndex",
  });

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
      foreignField: "treasuryProposal",
    }),
  ]);

  return proposals.map((proposal) => {
    const post = proposal.post;
    proposal.post = undefined;
    post.onchainData = proposal;
    post.state = proposal.state?.state;
    return post;
  });
}

async function getPostsByChain(page, pageSize) {
  const chain = process.env.CHAIN;
  const postCol = await getTreasuryProposalCollection();
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
      foreignField: "treasuryProposal",
    }),
    chainDb.lookupOne({
      from: "treasuryProposal",
      for: posts,
      as: "onchainData",
      localField: "proposalIndex",
      foreignField: "proposalIndex",
      projection: { timeline: 0 },
    }),
  ]);

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

async function getPostById(postId) {
  const chain = process.env.CHAIN;
  const q = {};
  if (ObjectId.isValid(postId)) {
    q._id = ObjectId(postId);
  } else {
    q.proposalIndex = parseInt(postId);
  }

  const postCol = await getTreasuryProposalCollection();
  const post = await postCol.findOne(q);

  if (!post) {
    throw new HttpError(404, "Post not found");
  }

  const commonDb = await getCommonDb();
  const businessDb = await getBusinessDb();
  const chainTreasuryProposalCol = await getChainTreasuryProposalCollection();
  const chainMotionCol = await getMotionCollection();
  const [, reactions, treasuryProposalData] = await Promise.all([
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
      foreignField: "treasuryProposal",
    }),
    chainTreasuryProposalCol.findOne({ proposalIndex: post.proposalIndex }),
  ]);

  const [, motions] = await Promise.all([
    lookupUser({ for: reactions, localField: "user" }),
    chainMotionCol
      .find({
        index: {
          $in: (treasuryProposalData?.motions?.map(m => m.index) || [])
        }
      })
      .toArray(),
  ]);

  return {
    ...post,
    onchainData: {
      ...treasuryProposalData,
      motions,
    },
  };
}

module.exports = {
  updatePost,
  getPostsByChain,
  getPostById,
  getActivePostsOverview,
};
