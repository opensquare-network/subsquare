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
  getPreImageCollection,
} = require("../mongo/chain");
const {
  getDb: getCommonDb,
  lookupUser,
  getUserCollection,
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

  const chainProposalCol = await getChainPublicProposalCollection();
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

  const chainDemocracyCol = await getChainPublicProposalCollection();
  const proposals = await chainDemocracyCol
    .find({
      "state.state": {
        $nin: ["Tabled"],
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
  const q = { proposalIndex: { $ne: null } };

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
      from: "democracyPublicProposal",
      for: posts,
      as: "state",
      localField: "proposalIndex",
      foreignField: "proposalIndex",
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
  } else if (postId.startsWith("0x")) {
    q.proposalIndex = postId;
  } else if (!isNaN(postId)) {
    q.proposalIndex = parseInt(postId);
  } else {
    q.proposalIndex = postId;
  }

  const postCol = await getDemocracyCollection();
  const post = await postCol.findOne(q);

  if (!post) {
    throw new HttpError(404, "Post not found");
  }

  const userCol = await getUserCollection();
  const businessDb = await getBusinessDb();
  const chainProposalCol = await getChainPublicProposalCollection();
  const preImageCol = await getPreImageCollection();
  const [author, reactions, chanProposalData] = await Promise.all([
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
    chainProposalCol.findOne({ proposalIndex: post.proposalIndex }),
  ]);

  const preImage = await preImageCol.findOne({ hash: chanProposalData?.hash });
  await lookupUser({ for: reactions, localField: "user" });

  return {
    ...post,
    author,
    authors: chanProposalData.authors,
    onchainData: {
      ...chanProposalData,
      preImage,
    },
  };
}

module.exports = {
  updatePost,
  getPostsByChain,
  getPostById,
  getActivePostsOverview,
};
