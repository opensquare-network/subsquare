const { ObjectId } = require("mongodb");
const { safeHtml } = require("../utils/post");
const { PostTitleLengthLimitation } = require("../constants");
const { getDb: getBusinessDb, getDemocracyCollection } = require("../mongo/business");
const {
  getDb: getChainDb,
  getPublicProposalCollection: getChainPublicProposalCollection,
  getExternalCollection: getChainExternalCollection,
  getReferendumCollection: getChainReferendumCollection,
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

  const chainProposalCol = await getChainReferendumCollection(chain);
  const chainProposal = await chainProposalCol.findOne({
    referendumIndex: post.referendumIndex,
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
  const chainDemocracyCol = await getChainReferendumCollection(chain);
  const proposals = await chainDemocracyCol.find(
    {
      "state.state": {
        $nin: [
          "Disapproved", "Approved", "Executed",
          "NotPassed", "Passed",
        ]
      }
    })
    .sort({ "indexer.blockHeight": -1 })
    .limit(3)
    .toArray();

  const commonDb = await getCommonDb(chain);
  const businessDb = await getBusinessDb(chain);
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

  return proposals.map(proposal => {
    const post = proposal.post;
    proposal.post = undefined;
    post.onchainData = proposal;
    post.state = proposal.state?.state;
    return post;
  });
}

async function getPostsByChain(chain, page, pageSize) {
  const q = { referendumIndex: {$ne: null} };

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

async function getPostById(chain, postId) {
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

  const postCol = await getDemocracyCollection(chain);
  const post = await postCol.findOne(q);

  if (!post) {
    throw new HttpError(404, "Post not found");
  }

  const userCol = await getUserCollection(chain);
  const businessDb = await getBusinessDb(chain);
  const chainProposalCol = await getChainReferendumCollection(chain);
  const [author, reactions, chanProposalData] = await Promise.all([
    post.proposer ? userCol.findOne({ [`${chain}Address`]: post.proposer }) : null,
    businessDb.lookupMany({
      from: "reaction",
      for: post,
      as: "reactions",
      localField: "_id",
      foreignField: "democracy",
    }),
    chainProposalCol.findOne({ referendumIndex: post.referendumIndex }),
  ]);

  if (chanProposalData.externalProposalHash) {
    const col = await getChainExternalCollection(chain);
    const democracyExternal = await col.findOne({
      proposalHash: chanProposalData.externalProposalHash,
      "indexer.blockHeight": chanProposalData.externalProposalIndexer.blockHeight,
    });
    chanProposalData.authors = democracyExternal.authors;
    chanProposalData.techCommMotionIndex =  democracyExternal.techCommMotionIndex;

    const preImageCol = await getPreImageCollection(chain);
    const preImage = await preImageCol.findOne({ hash: chanProposalData.externalProposalHash });
    chanProposalData.preImage = preImage;

  } else if (chanProposalData.publicProposalIndex !== undefined) {
    const col = await getChainPublicProposalCollection(chain);
    const democracyPublicProposal = await col.findOne({ proposalIndex: chanProposalData.publicProposalIndex });
    chanProposalData.authors = democracyPublicProposal.authors;

    const preImageCol = await getPreImageCollection(chain);
    const preImage = await preImageCol.findOne({ hash: democracyPublicProposal.hash });
    chanProposalData.preImage = preImage;

  }

  await lookupUser({ for: reactions, localField: "user" });

  return {
    ...post,
    author,
    onchainData: chanProposalData,
  };
}

module.exports =  {
  updatePost,
  getPostsByChain,
  getPostById,
  getActivePostsOverview,
};
