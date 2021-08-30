const { ObjectId } = require("mongodb");
const { safeHtml, extractMentions } = require("../utils/post");
const { PostTitleLengthLimitation } = require("../constants");
const { nextPostUid } = require("./status.service");
const {
  getCommentCollection,
  getReactionCollection,
  getDb: getBusinessDb
} = require("../mongo/business");
const { getUserCollection, lookupUser } = require("../mongo/common");
const { HttpError } = require("../exc");
const { ContentType } = require("../constants");
const mailService = require("./mail.service");

function createService(postType) {

  async function getPostCollection(chain) {
    const db = await getBusinessDb(chain);
    return db.getCollection(postType);
  }

  async function createPost(
    chain,
    title,
    content,
    contentType,
    author,
  ) {
    if (title.length > PostTitleLengthLimitation) {
      throw new HttpError(400, {
        title: [ "Title must be no more than %d characters" ],
      });
    }

    const postUid = await nextPostUid(chain);

    const now = new Date();

    const postCol = await getPostCollection(chain);
    const result = await postCol.insertOne(
      {
        postUid,
        title,
        content: contentType === ContentType.Html ? safeHtml(content) : content,
        contentType,
        author: author._id,
        lastActivityAt: new Date(),
        createdAt: now,
        updatedAt: now,
      }
    );

    if (!result.result.ok) {
      throw new HttpError(500, "Failed to create post");getComments
    }

    return postUid;
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
    const postCol = await getPostCollection(chain);
    const post = await postCol.findOne({ _id: postObjId });
    if (!post) {
      throw new HttpError(404, "Post does not exists");
    }

    if (!post.author.equals(author._id)) {
      throw new HttpError(403, "You are not the post author");
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
    const postCol = await getPostCollection(chain);
    const total = await postCol.countDocuments();

    if (page === "last") {
      const totalPages = Math.ceil(total / pageSize);
      page = totalPages;
    }

    const posts = await postCol.find({})
      .sort({ lastActivityAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    const businessDb = await getBusinessDb(chain);
    await Promise.all([
      lookupUser({ for: posts, localField: "author" }),
      businessDb.lookupCount({
        from: "comment",
        for: posts,
        as: "commentsCount",
        localField: "_id",
        foreignField: postType,
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
      q.postUid = postId;
    }

    const postCol = await getPostCollection(chain);
    const post = await postCol.findOne(q);

    const businessDb = await getBusinessDb(chain);
    const reaction = await businessDb.lookupMany({
      from: "reaction",
      for: post,
      as: "reactions",
      localField: "_id",
      foreignField: postType,
    });

    await lookupUser([
      { for: post, localField: "author" },
      { for: reaction, localField: "user" }
    ]);

    return post;
  }

  async function processPostThumbsUpNotification(chain, post, reactionUser) {
    const userCol = await getUserCollection();
    const postAuthor = await userCol.findOne({_id: post.author});

    if (!postAuthor) {
      return;
    }

    if (postAuthor.emailVerified && (postAuthor.notification?.thumbsUp ?? true)) {
      mailService.sendPostThumbsupEmail({
        email: postAuthor.email,
        postAuthor: postAuthor.username,
        chain,
        postType,
        postUid: post.postUid,
        reactionUser: reactionUser.username,
      });
    }
  }

  async function setPostReaction(chain, postId, reaction, user) {
    const postObjId = ObjectId(postId);

    const postCol = await getPostCollection(chain);
    const post = await postCol.findOne({
      _id: postObjId,
      author: { $ne: user._id },
    });
    if (!post) {
      throw new HttpError(400, "Cannot set reaction.");
    }

    const reactionCol = await getReactionCollection(chain);

    const now = new Date();
    const result = await reactionCol.updateOne(
      {
        [postType]: postObjId,
        user: user._id,
      },
      {
        $set: {
          reaction,
          updatedAt: now,
        },
        $setOnInsert: {
          createdAt: now,
        },
      },
      { upsert: true }
    );

    if (!result.result.ok) {
      throw new HttpError(500, "Db error, update reaction.");
    }

    processPostThumbsUpNotification(chain, post, user).catch(console.error);

    return true;
  }

  async function unsetPostReaction(chain, postId, user) {
    const postObjId = ObjectId(postId);

    const reactionCol = await getReactionCollection(chain);

    const result = await reactionCol.deleteOne({
      [postType]: postObjId,
      user: user._id,
    });

    if (!result.result.ok) {
      throw new HttpError(500, "Db error, clean reaction.");
    }

    if (result.result.nModified === 0) {
      return false;
    }

    return true;
  }

  async function processCommentMentions({
    chain,
    postType,
    postUid,
    content,
    contentType,
    author,
    commentHeight,
    mentions,
  }) {
    if (mentions.size === 0) {
      return;
    }

    const userCol = await getUserCollection();
    const users = await userCol.find({
      username: {
        $in: Array.from(mentions),
      },
    }).toArray();

    for (const user of users) {
      if (user.emailVerified && (user.notification?.mention ?? true)) {
        mailService.sendCommentMentionEmail({
          email: user.email,
          chain,
          postType,
          postUid,
          content,
          contentType,
          mentionedUser: user.username,
          author,
          commentHeight,
        });
      }
    }
  }

  async function postComment(
    chain,
    postId,
    content,
    contentType,
    author,
  ) {
    const postObjId = ObjectId(postId);

    const businessDb = await getBusinessDb(chain);
    const postCol = businessDb.getCollection(postType);
    const post = await postCol.findOne({_id: postObjId});
    if (!post) {
      throw new HttpError(400, "Post not found.");
    }

    const userCol = await getUserCollection();
    const postAuthor = await userCol.findOne({ _id: post.author });
    post.author = postAuthor;

    const commentCol = await getCommentCollection(chain);
    const height = await commentCol.countDocuments({ post: postObjId });

    const now = new Date();

    const newComment = {
      [postType]: postObjId,
      content: contentType === ContentType.Html ? safeHtml(content) : content,
      contentType,
      author: author._id,
      height: height + 1,
      createdAt: now,
      updatedAt: now,
    };
    const result = await commentCol.insertOne(newComment);

    if (!result.result.ok) {
      throw new HttpError(500, "Failed to create comment");
    }

    const newCommentId = result.ops[0]._id;

    const updatePostResult = await postCol.updateOne(
      { _id: postObjId },
      {
        $set: {
          lastActivityAt: new Date()
        }
      },
    );

    if (!updatePostResult.result.ok) {
      throw new HttpError(500, "Unable to udpate post last activity time");
    }

    const mentions = extractMentions(content, contentType);
    processCommentMentions({
      chain,
      postType,
      postUid: post.postUid,
      content: newComment.content,
      contentType: newComment.contentType,
      author: author.username,
      commentHeight: newComment.height,
      mentions,
    }).catch(console.error);

    if (!author._id.equals(post.author._id)) {
      if (post.author.emailVerified && (post.author.notification?.reply ?? true)) {
        mailService.sendReplyEmail({
          email: post.author.email,
          replyToUser: post.author.username,
          chain,
          postType,
          postUid: post.postUid,
          content: newComment.content,
          contentType: newComment.contentType,
          author: author.username,
          commentHeight: newComment.height,
        });
      }
    }

    return newCommentId;
  }

  async function getComments(chain, postId, page, pageSize) {
    const q = { [postType]: ObjectId(postId) };

    const commentCol = await getCommentCollection(chain);
    const total = await commentCol.count(q);

    if (page === "last") {
      const totalPages = Math.ceil(total / pageSize);
      page = totalPages;
    }

    const comments = await commentCol.find(q)
      .sort({ createdAt: 1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    const businessDb = await getBusinessDb(chain);
    const reactions = await businessDb.lookupMany({
      from: "reaction",
      for: comments,
      as: "reactions",
      localField: "_id",
      foreignField: "comment",
    });

    await lookupUser([
      { for: comments, localField: "author" },
      { for: reactions, localField: "user" },
    ]);

    return {
      items: comments,
      total,
      page,
      pageSize,
    };
  }

  return {
    createPost,
    getPostsByChain,
    getPostById,
    updatePost,
    setPostReaction,
    unsetPostReaction,
    postComment,
    getComments,
  };
}

module.exports = createService;
