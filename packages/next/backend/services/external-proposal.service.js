const { ObjectId } = require("mongodb");
const { safeHtml } = require("../utils/post");
const { PostTitleLengthLimitation, Day } = require("../constants");
const {
  getDb: getBusinessDb,
  getDemocracyCollection,
} = require("../mongo/business");
const {
  getDb: getChainDb,
  getExternalCollection: getChainExternalCollection,
  getPreImageCollection,
  getMotionCollection: getChainMotionCollection,
  getTechCommMotionCollection: getChainTechCommMotionCollection,
} = require("../mongo/chain");
const {
  getDb: getCommonDb,
  lookupUser,
  getUserCollection,
} = require("../mongo/common");
const { HttpError } = require("../exc");
const { ContentType } = require("../constants");
const { toUserPublicInfo } = require("../utils/user");

async function updatePost(postId, title, content, contentType, author) {
  const chain = process.env.CHAIN;
  const postObjId = ObjectId(postId);
  const postCol = await getDemocracyCollection();
  const post = await postCol.findOne({ _id: postObjId });
  if (!post) {
    throw new HttpError(404, "Post does not exists");
  }

  const chainExternalCol = await getChainExternalCollection();
  const chainProposal = await chainExternalCol.findOne({
    proposalHash: post.externalProposalHash,
    "indexer.blockHeight": post.indexer.blockHeight,
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

  const chainDemocracyCol = await getChainExternalCollection();
  const proposals = await chainDemocracyCol
    .find({
      "state.state": {
        $nin: [
          "Tabled",
          "ExternalTabled",
          "fastTrack",
          "Vetoed",
          "Overwritten",
        ],
      },
    })
    .sort({ "indexer.blockHeight": -1 })
    .toArray();

  const commonDb = await getCommonDb();
  const businessDb = await getBusinessDb();
  const posts = await businessDb.compoundLookupOne({
    from: "democracy",
    for: proposals,
    as: "post",
    compoundLocalFields: ["proposalHash", "indexer.blockHeight"],
    compoundForeignFields: ["externalProposalHash", "indexer.blockHeight"],
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
      foreignField: "democracy",
    }),
  ]);

  const result = proposals.map((proposal) => {
    const post = proposal.post;
    proposal.post = undefined;
    post.onchainData = proposal;
    post.state = proposal.state?.state;
    return post;
  });

  return result
    .filter((post) => post.lastActivityAt?.getTime() >= Date.now() - 7 * Day)
    .slice(0, 3);
}

async function getPostsByChain(page, pageSize) {
  const chain = process.env.CHAIN;
  const q = { externalProposalHash: { $ne: null } };

  const postCol = await getDemocracyCollection();
  const total = await postCol.countDocuments(q);

  if (page === "last") {
    const totalPages = Math.ceil(total / pageSize);
    page = Math.max(totalPages, 1);
  }

  const posts = await postCol
    .find(q)
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
      foreignField: "democracy",
    }),
    chainDb.compoundLookupOne({
      from: "democracyExternal",
      for: posts,
      as: "state",
      compoundLocalFields: ["externalProposalHash", "indexer.blockHeight"],
      compoundForeignFields: ["proposalHash", "indexer.blockHeight"],
      projection: { state: 1 },
      map: (data) => data.state?.state,
    }),
  ]);

  return {
    items: posts,
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
    const m = postId.match(/^(\d+)_(.+)$/);
    if (m) {
      q["indexer.blockHeight"] = parseInt(m[1]);
      q.externalProposalHash = m[2];
    } else {
      q.externalProposalHash = postId;
    }
  }

  const postCol = await getDemocracyCollection();
  const post = await postCol.findOne(q, {
    sort: { "indexer.blockHeight": -1 },
  });

  if (!post) {
    throw new HttpError(404, "Post not found");
  }

  const userCol = await getUserCollection();
  const businessDb = await getBusinessDb();
  const preImageCol = await getPreImageCollection();
  const chainExternalCol = await getChainExternalCollection();
  const chainMotionCol = await getChainMotionCollection();
  const chainTechCommMotionCol = await getChainTechCommMotionCollection();

  const [author, reactions, chainExternalProposal, preImage] =
    await Promise.all([
      post.proposer
        ? userCol.findOne({ [`${chain}Address`]: post.proposer })
        : null,
      businessDb.lookupMany({
        from: "reaction",
        for: post,
        as: "reactions",
        localField: "_id",
        foreignField: "democracy",
      }),
      chainExternalCol.findOne({
        proposalHash: post.externalProposalHash,
        "indexer.blockHeight": post.indexer.blockHeight,
      }),
      preImageCol.findOne({ hash: post.externalProposalHash }),
    ]);

  const [, motions, techCommMotions] = await Promise.all([
    lookupUser({ for: reactions, localField: "user" }),
    chainExternalProposal.motions?.length > 0
      ? chainMotionCol
          .find({
            $or: chainExternalProposal.motions.map((motion) => ({
              hash: motion.hash,
              "indexer.blockHeight": motion.indexer.blockHeight,
            })),
          })
          .toArray()
      : [],
    chainExternalProposal.techCommMotions?.length > 0
      ? chainTechCommMotionCol
          .find({
            $or: chainExternalProposal.techCommMotions.map((motion) => ({
              hash: motion.hash,
              "indexer.blockHeight": motion.indexer.blockHeight,
            })),
          })
          .toArray()
      : [],
  ]);

  return {
    ...post,
    author: toUserPublicInfo(author),
    authors: chainExternalProposal.authors,
    onchainData: {
      ...chainExternalProposal,
      preImage,
      motions,
      techCommMotions,
    },
  };
}

module.exports = {
  updatePost,
  getPostsByChain,
  getPostById,
  getActivePostsOverview,
};
