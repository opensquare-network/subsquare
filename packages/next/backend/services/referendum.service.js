const { ObjectId } = require("mongodb");
const { safeHtml } = require("@subsquare/backend-common/utils/post");
const { PostTitleLengthLimitation, Day } = require("@subsquare/backend-common/constants");
const {
  getDb: getBusinessDb,
  getDemocracyCollection,
} = require("../mongo/business");
const {
  getDb: getChainDb,
  getPublicProposalCollection: getChainPublicProposalCollection,
  getExternalCollection: getChainExternalCollection,
  getReferendumCollection: getChainReferendumCollection,
  getPreImageCollection,
} = require("../mongo/chain");
const {
  getDb: getCommonDb,
  lookupUser,
  getUserByAddress,
} = require("@subsquare/backend-common/mongo/common");
const { HttpError } = require("@subsquare/backend-common/exc");
const { ContentType } = require("@subsquare/backend-common/constants");
const { toUserPublicInfo } = require("@subsquare/backend-common/utils/user");

async function updatePost(postId, title, content, contentType, author) {
  const chain = process.env.CHAIN;
  const postObjId = ObjectId(postId);
  const postCol = await getDemocracyCollection();
  const post = await postCol.findOne({ _id: postObjId });
  if (!post) {
    throw new HttpError(404, "Post does not exists");
  }

  const chainReferendumCol = await getChainReferendumCollection();
  const chainReferendum = await chainReferendumCol.findOne({
    referendumIndex: post.referendumIndex,
  });

  if (!chainReferendum) {
    throw new HttpError(404, "On-chain data is not found");
  }

  let authors = [];
  if (chainReferendum.externalProposalHash) {
    const col = await getChainExternalCollection();
    const chainExternal = await col.findOne({
      proposalHash: chainReferendum.externalProposalHash,
      "indexer.blockHeight":
        chainReferendum.externalProposalIndexer.blockHeight,
    });
    authors = chainExternal?.authors || [];
  } else if (chainReferendum.publicProposalIndex !== undefined) {
    const col = await getChainPublicProposalCollection();
    const chainPublicProposal = await col.findOne({
      proposalIndex: chainReferendum.publicProposalIndex,
    });
    authors = chainPublicProposal?.authors || [];
  }

  if (!authors.includes(author[`${chain}Address`])) {
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

  const chainDemocracyCol = await getChainReferendumCollection();
  const proposals = await chainDemocracyCol
    .find({
      "state.state": {
        $nin: ["Executed", "NotPassed", "Passed", "Cancelled"],
      },
    })
    .sort({ "indexer.blockHeight": -1 })
    .toArray();

  const commonDb = await getCommonDb();
  const businessDb = await getBusinessDb();
  const posts = await businessDb.lookupOne({
    from: "democracy",
    for: proposals,
    as: "post",
    localField: "referendumIndex",
    foreignField: "referendumIndex",
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
  const q = { referendumIndex: { $ne: null } };

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
    chainDb.lookupOne({
      from: "democracyReferendum",
      for: posts,
      as: "state",
      localField: "referendumIndex",
      foreignField: "referendumIndex",
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
  const q = {};
  if (ObjectId.isValid(postId)) {
    q._id = ObjectId(postId);
  } else if (postId.startsWith("0x")) {
    q.referendumIndex = postId;
  } else if (!isNaN(postId)) {
    q.referendumIndex = parseInt(postId);
  } else {
    q.referendumIndex = postId;
  }

  const postCol = await getDemocracyCollection();
  const post = await postCol.findOne(q);

  if (!post) {
    throw new HttpError(404, "Post not found");
  }

  const businessDb = await getBusinessDb();
  const chainReferendumCol = await getChainReferendumCollection();
  const [author, reactions, chainReferendum] = await Promise.all([
    post.proposer
      ? getUserByAddress(post.proposer)
      : null,
    businessDb.lookupMany({
      from: "reaction",
      for: post,
      as: "reactions",
      localField: "_id",
      foreignField: "democracy",
    }),
    chainReferendumCol.findOne({ referendumIndex: post.referendumIndex }),
  ]);

  if (chainReferendum?.externalProposalHash) {
    const col = await getChainExternalCollection();
    const chainExternal = await col.findOne({
      proposalHash: chainReferendum.externalProposalHash,
      "indexer.blockHeight":
        chainReferendum.externalProposalIndexer.blockHeight,
    });

    chainReferendum.authors = chainExternal?.authors;
    chainReferendum.techCommMotions = chainExternal?.techCommMotions;

    const preImageCol = await getPreImageCollection();
    const preImage = await preImageCol.findOne({
      hash: chainReferendum.externalProposalHash,
    });

    chainReferendum.preImage = preImage;
  } else if (chainReferendum?.publicProposalIndex !== undefined) {
    const col = await getChainPublicProposalCollection();
    const chainPublicProposal = await col.findOne({
      proposalIndex: chainReferendum.publicProposalIndex,
    });
    chainReferendum.authors = chainPublicProposal?.authors;

    const preImageCol = await getPreImageCollection();
    const preImage = await preImageCol.findOne({
      hash: chainPublicProposal?.hash,
    });
    chainReferendum.preImage = preImage;
  }

  await lookupUser({ for: reactions, localField: "user" });

  return {
    ...post,
    author,
    authors: chainReferendum.authors,
    onchainData: chainReferendum,
  };
}

module.exports = {
  updatePost,
  getPostsByChain,
  getPostById,
  getActivePostsOverview,
};
