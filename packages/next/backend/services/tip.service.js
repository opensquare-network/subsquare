const { ObjectId } = require("mongodb");
const { safeHtml } = require("@subsquare/backend-common/utils/post");
const { PostTitleLengthLimitation, Day } = require("@subsquare/backend-common/constants");
const { getDb: getBusinessDb, getTipCollection } = require("../mongo/business");
const {
  getDb: getChainDb,
  getTipCollection: getChainTipCollection,
} = require("../mongo/chain");
const { getDb: getCommonDb, lookupUser } = require("@subsquare/backend-common/mongo/common");
const { HttpError } = require("@subsquare/backend-common/exc");
const { ContentType } = require("@subsquare/backend-common/constants");
const { toUserPublicInfo } = require("@subsquare/backend-common/utils/user");

async function updatePost(postId, title, content, contentType, author) {
  const chain = process.env.CHAIN;
  const postObjId = ObjectId(postId);
  const postCol = await getTipCollection();
  const post = await postCol.findOne({ _id: postObjId });
  if (!post) {
    throw new HttpError(404, "Post does not exists");
  }

  const chainTipCol = await getChainTipCollection();
  const chainTip = await chainTipCol.findOne({
    hash: post.hash,
    "indexer.blockHeight": post.height,
  });

  if (!chainTip) {
    throw new HttpError(404, "On-chain data is not found");
  }

  if (!chainTip.authors.includes(author[`${chain}Address`])) {
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

  const chainTipCol = await getChainTipCollection();
  const tips = await chainTipCol
    .find(
      {
        "state.state": { $in: ["NewTip", "tip"] },
      },
      {
        projection: { timeline: 0 },
      }
    )
    .sort({ "indexer.blockHeight": -1 })
    .toArray();

  const commonDb = await getCommonDb();
  const businessDb = await getBusinessDb();
  const posts = await businessDb.compoundLookupOne({
    from: "tip",
    for: tips,
    as: "post",
    compoundLocalFields: ["indexer.blockHeight", "hash"],
    compoundForeignFields: ["height", "hash"],
  });

  await Promise.all([
    commonDb.lookupOne({
      from: "user",
      for: posts,
      as: "author",
      localField: "finder",
      foreignField: `${chain}Address`,
      map: toUserPublicInfo,
    }),
    businessDb.lookupCount({
      from: "comment",
      for: posts,
      as: "commentsCount",
      localField: "_id",
      foreignField: "tip",
    }),
  ]);

  const result = tips.map((tip) => {
    const post = tip.post;
    tip.post = undefined;
    post.onchainData = tip;
    post.state = {
      state: tip.state?.state,
      tipsCount: (tip.meta?.tips || []).length,
    };
    return post;
  });

  return result
    .filter((post) => post.lastActivityAt?.getTime() >= Date.now() - 7 * Day)
    .slice(0, 3);
}

async function getPostsByChain(page, pageSize) {
  const chain = process.env.CHAIN;
  const postCol = await getTipCollection();
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
      localField: "finder",
      foreignField: `${chain}Address`,
      map: toUserPublicInfo,
    }),
    businessDb.lookupCount({
      from: "comment",
      for: posts,
      as: "commentsCount",
      localField: "_id",
      foreignField: "tip",
    }),
    chainDb.compoundLookupOne({
      from: "tip",
      for: posts,
      projection: { timeline: 0 },
      as: "onchainData",
      compoundLocalFields: ["height", "hash"],
      compoundForeignFields: ["indexer.blockHeight", "hash"],
    }),
  ]);

  return {
    items: posts.map((p) => ({
      ...p,
      state: {
        state: p.onchainData?.state?.state,
        tipsCount: (p.onchainData?.meta?.tips || []).length,
      },
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
    const m = postId.match(/^(\d+)_(.+)$/);
    if (m) {
      q.height = parseInt(m[1]);
      q.hash = m[2];
    } else {
      q.hash = postId;
    }
  }

  const postCol = await getTipCollection();
  const post = await postCol.findOne(q);

  if (!post) {
    throw new HttpError(404, "Post not found");
  }

  const commonDb = await getCommonDb();
  const businessDb = await getBusinessDb();
  const chainTipCol = await getChainTipCollection();
  const [, reactions, tipData] = await Promise.all([
    commonDb.lookupOne({
      from: "user",
      for: post,
      as: "author",
      localField: "finder",
      foreignField: `${chain}Address`,
      map: toUserPublicInfo,
    }),
    businessDb.lookupMany({
      from: "reaction",
      for: post,
      as: "reactions",
      localField: "_id",
      foreignField: "tip",
    }),
    chainTipCol.findOne({
      "indexer.blockHeight": post.height,
      hash: post.hash,
    }),
  ]);

  await lookupUser({ for: reactions, localField: "user" });

  return {
    ...post,
    authors: tipData.authors,
    onchainData: tipData,
  };
}

module.exports = {
  updatePost,
  getPostsByChain,
  getPostById,
  getActivePostsOverview,
};
