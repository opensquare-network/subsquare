const { ObjectId } = require("mongodb");
const { safeHtml } = require("../utils/post");
const { PostTitleLengthLimitation } = require("../constants");
const { getDb: getBusinessDb, getDemocracyCollection } = require("../mongo/business");
const { getDb: getChainDb } = require("../mongo/chain");
const { getDb: getCommonDb, lookupUser } = require("../mongo/common");
const { HttpError } = require("../exc");
const { ContentType } = require("../constants");
const { toUserPublicInfo } = require("../utils/user");

function createService(proposalType, indexField) {

  async function getChainDemocracyCollection(chain) {
    const chainDb = await getChainDb(chain);
    return chainDb.getCollection(proposalType);
  }

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

    const chainProposalCol = await getChainDemocracyCollection(chain);
    const chainProposal = await chainProposalCol.findOne({
      [indexField]: post[indexField],
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

  async function getPostsByChain(chain, page, pageSize) {
    const q = { [indexField]: {$ne: null} };

    const postCol = await getDemocracyCollection(chain);
    const total = await postCol.countDocuments(q);

    if (page === "last") {
      const totalPages = Math.ceil(total / pageSize);
      page = totalPages;
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
      businessDb.lookupCount({
        from: "comment",
        for: posts,
        as: "commentsCount",
        localField: "_id",
        foreignField: "democracy",
      }),
      chainDb.lookupOne({
        from: proposalType,
        for: posts,
        as: "state",
        localField: indexField,
        foreignField: indexField,
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
      q[indexField] = parseInt(postId);
    }

    const postCol = await getDemocracyCollection(chain);
    const post = await postCol.findOne(q);

    if (!post) {
      throw new HttpError(404, "Post not found");
    }

    const commonDb = await getCommonDb(chain);
    const businessDb = await getBusinessDb(chain);
    const chainProposalCol = await getChainDemocracyCollection(chain);
    const [reactions, chanProposalData] = await Promise.all([
      businessDb.lookupMany({
        from: "reaction",
        for: post,
        as: "reactions",
        localField: "_id",
        foreignField: "democracy",
      }),
      chainProposalCol.findOne({ [indexField]: post[indexField] }),
    ]);

    await lookupUser({ for: reactions, localField: "user" });

    return {
      ...post,
      [proposalType]: chanProposalData,
    };
  }

  return {
    updatePost,
    getPostsByChain,
    getPostById,
  };

}

module.exports = createService;
