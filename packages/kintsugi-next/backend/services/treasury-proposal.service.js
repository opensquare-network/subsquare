const { ObjectId } = require("mongodb");
const { safeHtml } = require("@subsquare/backend-common/utils/post");
const {
  ContentType,
  PostTitleLengthLimitation,
  Day
} = require("@subsquare/backend-common/constants");
const {
  getDb: getBusinessDb,
  getTreasuryProposalCollection,
} = require("../mongo/business");
const {
  getDb: getChainDb,
  getTreasuryProposalCollection: getChainTreasuryProposalCollection,
} = require("../mongo/chain");
const {
  getDb: getCommonDb,
  lookupUser,
  getUserByAddress,
} = require("@subsquare/backend-common/mongo/common");
const { HttpError } = require("@subsquare/backend-common/exc");
const { toUserPublicInfo } = require("@subsquare/backend-common/utils/user");

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
    throw new HttpError(404, "On-chain data is not found");
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

  const chainProposalCol = await getChainTreasuryProposalCollection();
  const proposals = await chainProposalCol
    .find(
      {
        $or: [
          {
            "state.state": {
              $nin: ["Awarded", "Approved", "Rejected"]
            }
          },
          {
            "state.indexer.blockTime": {
              $gt: Date.now() - 3 * Day
            },
          }
        ]
      },
      {
        projection: {
          timeline: 0
        },
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

  const result = proposals.map((proposal) => {
    const post = proposal.post;
    proposal.post = undefined;
    post.onchainData = proposal;
    post.state = proposal.state?.state;
    return post;
  });

  return result;
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

  const businessDb = await getBusinessDb();
  const chainTreasuryProposalCol = await getChainTreasuryProposalCollection();
  const [author, reactions, treasuryProposalData] = await Promise.all([
    post.proposer
      ? getUserByAddress(post.proposer)
      : null,
    businessDb.lookupMany({
      from: "reaction",
      for: post,
      as: "reactions",
      localField: "_id",
      foreignField: "treasuryProposal",
    }),
    chainTreasuryProposalCol.findOne({ proposalIndex: post.proposalIndex }),
  ]);

  await Promise.all([
    lookupUser({ for: reactions, localField: "user" }),
  ]);

  return {
    ...post,
    author,
    authors: treasuryProposalData.authors,
    onchainData: {
      ...treasuryProposalData,
    },
  };
}

module.exports = {
  updatePost,
  getPostsByChain,
  getPostById,
  getActivePostsOverview,
};
