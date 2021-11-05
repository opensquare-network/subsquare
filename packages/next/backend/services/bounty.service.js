const { ObjectId } = require("mongodb");
const { safeHtml } = require("../utils/post");
const { PostTitleLengthLimitation } = require("../constants");
const {
  getDb: getBusinessDb,
  getBountyCollection,
} = require("../mongo/business");
const {
  getDb: getChainDb,
  getBountyCollection: getChainBountyCollection,
  getMotionCollection,
} = require("../mongo/chain");
const { getDb: getCommonDb, lookupUser } = require("../mongo/common");
const { HttpError } = require("../exc");
const { ContentType } = require("../constants");
const { toUserPublicInfo } = require("../utils/user");

async function updatePost(chain, postId, title, content, contentType, author) {
  const postObjId = ObjectId(postId);
  const postCol = await getBountyCollection(chain);
  const post = await postCol.findOne({ _id: postObjId });
  if (!post) {
    throw new HttpError(404, "Post does not exists");
  }

  const chainBountyCol = await getChainBountyCollection(chain);
  const chainBounty = await chainBountyCol.findOne({
    bountyIndex: post.bountyIndex,
  });

  if (!chainBounty) {
    throw new HttpError(403, "On-chain data is not found");
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

async function getActivePostsOverview(chain) {
  const chainBountyCol = await getChainBountyCollection(chain);
  const bounties = await chainBountyCol
    .find(
      {
        //TODO: Not sure what state to be shown:
        // Proposed, Approved, Funded, CuratorProposed, Active, PendingPayout
        "state.state": {
          $nin: ["Active", "PendingPayout", "Rejected", "Claimed"],
        },
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

  return bounties.map((bounty) => {
    const post = bounty.post;
    bounty.post = undefined;
    post.onchainData = bounty;
    post.state = bounty.state?.state;
    return post;
  });
}

async function getPostsByChain(chain, page, pageSize) {
  const postCol = await getBountyCollection(chain);
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

async function getPostById(chain, postId) {
  const q = {};
  if (ObjectId.isValid(postId)) {
    q._id = ObjectId(postId);
  } else {
    q.bountyIndex = parseInt(postId);
  }

  const postCol = await getBountyCollection(chain);
  const post = await postCol.findOne(q);

  if (!post) {
    throw new HttpError(404, "Post not found");
  }

  const commonDb = await getCommonDb(chain);
  const businessDb = await getBusinessDb(chain);
  const chainBountyCol = await getChainBountyCollection(chain);
  const chainMotionCol = await getMotionCollection(chain);
  const [, reactions, bountyData, motions] = await Promise.all([
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
    chainMotionCol.find({ bountyIndex: post.bountyIndex }).toArray(),
  ]);

  await lookupUser({ for: reactions, localField: "user" });

  return {
    ...post,
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
