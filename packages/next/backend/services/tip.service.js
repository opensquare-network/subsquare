const { ObjectId } = require("mongodb");
const { safeHtml } = require("../utils/post");
const { PostTitleLengthLimitation } = require("../constants");
const { getDb: getBusinessDb, getTipCollection } = require("../mongo/business");
const {
  getDb: getChainDb,
  getTipCollection: getChainTipCollection,
} = require("../mongo/chain");
const { getDb: getCommonDb, lookupUser } = require("../mongo/common");
const { HttpError } = require("../exc");
const { ContentType } = require("../constants");
const { toUserPublicInfo } = require("../utils/user");

async function updatePost(chain, postId, title, content, contentType, author) {
  const postObjId = ObjectId(postId);
  const postCol = await getTipCollection(chain);
  const post = await postCol.findOne({ _id: postObjId });
  if (!post) {
    throw new HttpError(404, "Post does not exists");
  }

  const chainTipCol = await getChainTipCollection(chain);
  const chainTip = await chainTipCol.findOne({
    hash: post.hash,
    "indexer.blockHeight": post.height,
  });

  if (!chainTip) {
    throw new HttpError(403, "On-chain data is not found");
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
        updatedAt: now,
        lastActivityAt: now,
      },
    }
  );

  if (!result.result.ok) {
    throw new HttpError(500, "Failed to update post");
  }

  return true;
}

async function getActivePostsOverview(chain) {
  const chainTipCol = await getChainTipCollection(chain);
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
    .limit(3)
    .toArray();

  const commonDb = await getCommonDb(chain);
  const businessDb = await getBusinessDb(chain);
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

  return tips.map((tip) => {
    const post = tip.post;
    tip.post = undefined;
    post.onchainData = tip;
    post.state = {
      state: tip.state?.state,
      tipsCount: (tip.meta?.tips || []).length,
    };
    return post;
  });
}

async function getPostsByChain(chain, page, pageSize) {
  const postCol = await getTipCollection(chain);
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

  const commonDb = await getCommonDb(chain);
  const businessDb = await getBusinessDb(chain);
  const chainDb = await getChainDb(chain);
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
      state: p.onchainData?.state?.state,
      tipsCount: (p.onchainData?.meta?.tips || []).length,
    })),
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
      q.height = parseInt(m[1]);
      q.hash = m[2];
    } else {
      q.hash = postId;
    }
  }

  const postCol = await getTipCollection(chain);
  const post = await postCol.findOne(q);

  if (!post) {
    throw new HttpError(404, "Post not found");
  }

  const commonDb = await getCommonDb(chain);
  const businessDb = await getBusinessDb(chain);
  const chainTipCol = await getChainTipCollection(chain);
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
    onchainData: tipData,
  };
}

module.exports = {
  updatePost,
  getPostsByChain,
  getPostById,
  getActivePostsOverview,
};
