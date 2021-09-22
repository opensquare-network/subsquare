const { ObjectId } = require("mongodb");
const { safeHtml } = require("../utils/post");
const { PostTitleLengthLimitation } = require("../constants");
const { getDb: getBusinessDb, getDemocracyCollection } = require("../mongo/business");
const {
  getDb: getChainDb,
  getExternalCollection: getChainExternalCollection,
  getPreImageCollection,
} = require("../mongo/chain");
const { getDb: getCommonDb, lookupUser, getUserCollection } = require("../mongo/common");
const { HttpError } = require("../exc");
const { ContentType } = require("../constants");
const { toUserPublicInfo } = require("../utils/user");

async function updatePost(
  chain,
  postId,
  title,
  content,
  contentType,
  author
) {
  const postObjId = ObjectId(postId);
  const postCol = await getDemocracyCollection(chain);
  const post = await postCol.findOne({ _id: postObjId });
  if (!post) {
    throw new HttpError(404, "Post does not exists");
  }

  const chainProposalCol = await getChainExternalCollection(chain);
  const chainProposal = await chainProposalCol.findOne({
    proposalHash: post.externalProposalHash,
    "indexer.blockHeight": post.indexer.blockHeight,
  });

  if (!chainProposal) {
    throw new HttpError(403, "On-chain data is not found");
  }

  if (!chainProposal.authors.includes(author[`${chain}Address`])) {
    throw new HttpError(403, "You cannot edit");
  }

  if (title.length > PostTitleLengthLimitation) {
    throw new HttpError(400, {
      title: [ "Title must be no more than %d characters" ],
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
        updatedAt: now,
        lastActivityAt: now,
      }
    }
  );

  if (!result.result.ok) {
    throw new HttpError(500, "Failed to update post");
  }

  return true;
}

async function getActivePostsOverview(chain) {
  const chainDemocracyCol = await getChainExternalCollection(chain);
  const proposals = await chainDemocracyCol.find(
    {
      "state.state": {
        $nin: [
          "Tabled", "ExternalTabled", "fastTrack", "Vetoed",
        ]
      }
    })
    .sort({ "indexer.blockHeight": -1 })
    .limit(3)
    .toArray();

  const commonDb = await getCommonDb(chain);
  const businessDb = await getBusinessDb(chain);
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

  return proposals.map(proposal => {
    const post = proposal.post;
    proposal.post = undefined;
    post.onchainData = proposal;
    post.state = proposal.state?.state;
    return post;
  });
}

async function getPostsByChain(chain, page, pageSize) {
  const q = { externalProposalHash: {$ne: null} };

  const postCol = await getDemocracyCollection(chain);
  const total = await postCol.countDocuments(q);

  if (page === "last") {
    const totalPages = Math.ceil(total / pageSize);
    page = Math.max(totalPages, 1);
  }

  const posts = await postCol.find(q)
    .sort({ lastActivityAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .toArray();

  const commonDb = await getCommonDb(chain);
  const businessDb = await getBusinessDb(chain);
  const chainDb = await getChainDb(chain);
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

async function getPostById(chain, postId) {
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

  const postCol = await getDemocracyCollection(chain);
  const post = await postCol.findOne(q, { sort: {"indexer.blockHeight": -1} });

  if (!post) {
    throw new HttpError(404, "Post not found");
  }

  const userCol = await getUserCollection(chain);
  const businessDb = await getBusinessDb(chain);
  const chainProposalCol = await getChainExternalCollection(chain);
  const preImageCol = await getPreImageCollection(chain);
  const [author, reactions, chanProposalData, preImage] = await Promise.all([
    post.proposer ? userCol.findOne({ [`${chain}Address`]: post.proposer }) : null,
    businessDb.lookupMany({
      from: "reaction",
      for: post,
      as: "reactions",
      localField: "_id",
      foreignField: "democracy",
    }),
    chainProposalCol.findOne({
      proposalHash: post.externalProposalHash,
      "indexer.blockHeight": post.indexer.blockHeight,
    }),
    preImageCol.findOne({ hash: post.externalProposalHash })
  ]);

  await lookupUser({ for: reactions, localField: "user" });

  return {
    ...post,
    author,
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
