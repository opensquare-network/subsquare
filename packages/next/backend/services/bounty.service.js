const { ObjectId } = require("mongodb");
const { safeHtml } = require("@subsquare/backend-common/utils/post");
const { PostTitleLengthLimitation, Day } = require("@subsquare/backend-common/constants");
const {
  getDb: getBusinessDb,
  getBountyCollection,
} = require("../mongo/business");
const {
  getDb: getChainDb,
  getBountyCollection: getChainBountyCollection,
  getMotionCollection,
} = require("../mongo/chain");
const { getDb: getCommonDb, lookupUser } = require("@subsquare/backend-common/mongo/common");
const { HttpError } = require("@subsquare/backend-common/exc");
const { ContentType } = require("@subsquare/backend-common/constants");
const { toUserPublicInfo } = require("@subsquare/backend-common/utils/user");

async function updatePost(postId, title, content, contentType, author) {
  const chain = process.env.CHAIN;

  const postObjId = ObjectId(postId);
  const postCol = await getBountyCollection();
  const post = await postCol.findOne({ _id: postObjId });
  if (!post) {
    throw new HttpError(404, "Post does not exists");
  }

  const chainBountyCol = await getChainBountyCollection();
  const chainBounty = await chainBountyCol.findOne({
    bountyIndex: post.bountyIndex,
  });

  if (!chainBounty) {
    throw new HttpError(404, "On-chain data is not found");
  }

  if (!chainBounty.authors.includes(author[`${chain}Address`])) {
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

  const chainBountyCol = await getChainBountyCollection();
  const bounties = await chainBountyCol
    .find(
      {
        $or: [
          {
            "state.state": {
              $nin: ["Active", "PendingPayout", "Rejected", "Claimed"]
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
    from: "bounty",
    for: bounties,
    as: "post",
    localField: "bountyIndex",
    foreignField: "bountyIndex",
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
      foreignField: "bounty",
    }),
  ]);

  const result = bounties.map((bounty) => {
    const post = bounty.post;
    bounty.post = undefined;
    post.onchainData = bounty;
    post.state = bounty.state?.state;
    return post;
  });

  return result;
}

async function getPostsByChain(page, pageSize) {
  const chain = process.env.CHAIN;
  const postCol = await getBountyCollection();
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
      foreignField: "bounty",
    }),
    chainDb.lookupOne({
      from: "bounty",
      for: posts,
      as: "onchainData",
      localField: "bountyIndex",
      foreignField: "bountyIndex",
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
    q.bountyIndex = parseInt(postId);
  }

  const postCol = await getBountyCollection();
  const post = await postCol.findOne(q);

  if (!post) {
    throw new HttpError(404, "Post not found");
  }

  const commonDb = await getCommonDb();
  const businessDb = await getBusinessDb();
  const chainBountyCol = await getChainBountyCollection();
  const chainMotionCol = await getMotionCollection();
  const [, reactions, bountyData] = await Promise.all([
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
      foreignField: "bounty",
    }),
    chainBountyCol.findOne({ bountyIndex: post.bountyIndex }),
  ]);

  const [, motions] = await Promise.all([
    lookupUser({ for: reactions, localField: "user" }),
    bountyData?.motions?.length > 0
      ? chainMotionCol
          .find({
            $or: bountyData.motions.map((motion) => ({
              hash: motion.hash,
              "indexer.blockHeight": motion.indexer.blockHeight,
            })),
          })
          .toArray()
      : [],
  ]);

  return {
    ...post,
    authors: bountyData.authors,
    onchainData: {
      ...bountyData,
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
