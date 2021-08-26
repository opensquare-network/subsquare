const { ObjectId } = require("mongodb");
const xss = require("xss");
const cheerio = require("cheerio");
const { PostTitleLengthLimitation } = require("../constants");
const { nextPostUid } = require("./status.service");
const {
  getPostCollection,
  getCommentCollection,
  getReactionCollection,
  getDb: getBusinessDb
} = require("../mongo/business");
const { getUserCollection, lookupUser } = require("../mongo/common");
const { HttpError } = require("../exc");
const { ContentType } = require("../constants");
const mailService = require("./mail.service");

const xssOptions = {
  whiteList: {
    p: ["class"],
    span: ["class", "data-denotation-char", "data-id", "data-value"],
    br: [],
    blockquote: ["class"],
    pre: ["class"],
    ol: [],
    ul: [],
    li: ["class"],
    strong: [],
    em: [],
    u: [],
    s: [],
    a: ["href", "title", "target", "rel"],
    h1: ["class"],
    h2: ["class"],
    h3: ["class"],
    h4: ["class"],
    h5: ["class"],
    h6: ["class"],
    img: ["src", "width", "class"],
  },
  stripIgnoreTag: true,
  stripIgnoreTagBody: ["script"],
};

const myXss = new xss.FilterXSS(xssOptions);
function safeHtml(html) {
  return myXss.process(html);
}

function extractMentions(content, contentType) {
  const mentions = new Set();
  if (contentType === ContentType.Markdown) {
    const reMention = /\[@(\w+)\]\(\/member\/(\w+)\)/g;
    let match;
    while ((match = reMention.exec(content)) !== null) {
      const [, u1, u2] = match;
      if (u1 === u2) {
        mentions.add(u1);
      }
    }
  }

  if (contentType === ContentType.Html) {
    const $ = cheerio.load(content);
    $(".mention").each((i, el) => {
      const at = $(el).attr("data-id");
      if (at) {
        mentions.add(at);
      }
    });
  }

  return mentions;
}

async function processCommentMentions({
  chain,
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
      chain,
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

async function postComment(
  chain,
  postId,
  content,
  contentType,
  author,
) {
  const postObjId = ObjectId(postId);

  const postCol = await getPostCollection(chain);
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
    post: postObjId,
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
      foreignField: "post",
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
    for: post,
    from: "reaction",
    as: "reactions",
    localField: "_id",
    foreignField: "post"
  });

  await lookupUser([
    { for: post, localField: "author" },
    { for: reaction, localField: "user" }
  ]);

  return post;
}

async function getComments(chain, postId, page, pageSize) {
  const q = { post: ObjectId(postId) };

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

async function updateComment(
  chain,
  commentId,
  content,
  contentType,
  author,
) {
  const commentObjId = ObjectId(commentId);
  const commentCol = await getCommentCollection(chain);
  const comment = await commentCol.findOne({ _id: commentObjId });
  if (!comment) {
    throw new HttpError(404, "Comment does not exists");
  }

  if (!comment.author.equals(author._id)) {
    throw new HttpError(403, "You are not the comment author");
  }

  const result = await commentCol.updateOne(
    { _id: commentObjId },
    {
      $set: {
        content: contentType === ContentType.Html ? safeHtml(content) : content,
        contentType,
        updatedAt: new Date(),
      }
    }
  );

  if (!result.result.ok) {
    throw new HttpError(500, "Failed to update comment");
  }

  return true;
}


async function unsetCommentReaction(chain, commentId, user) {
  const commmentObjId = ObjectId(commentId);

  const reactionCol = await getReactionCollection(chain);

  const result = await reactionCol.deleteOne({
    comment: commmentObjId,
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

async function processCommentThumbsUpNotification(chain, comment, reactionUser) {
  const postCol = await getPostCollection(chain);
  const userCol = await getUserCollection();
  const [post, commentAuthor] = await Promise.all([
    postCol.findOne({_id: comment.post}),
    userCol.findOne({_id: comment.author}),
  ]);

  if (!post || !commentAuthor) {
    return;
  }

  if (commentAuthor.emailVerified && (commentAuthor.notification?.thumbsUp ?? true)) {
    mailService.sendCommentThumbsupEmail({
      email: commentAuthor.email,
      commentAuthor: commentAuthor.username,
      chain,
      postUid: post.postUid,
      commentHeight: comment.height,
      content: comment.content,
      contentType: comment.contentType,
      reactionUser: reactionUser.username,
    });
  }
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
      postUid: post.postUid,
      reactionUser: reactionUser.username,
    });
  }
}

async function setCommentReaction(chain, commentId, reaction, user) {
  const commmentObjId = ObjectId(commentId);

  const commentCol = await getCommentCollection(chain);
  const comment = await commentCol.findOne({
    _id: commmentObjId,
    author: { $ne: user._id },
  });
  if (!comment) {
    throw new HttpError(400, "Cannot set reaction.");
  }

  const reactionCol = await getReactionCollection(chain);

  const now = new Date();
  const result = await reactionCol.updateOne(
    {
      comment: commmentObjId,
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

  processCommentThumbsUpNotification(chain, comment, user).catch(console.error);

  return true;
}

async function getComment(chain, commentId) {
  const commentObjId = ObjectId(commentId);

  const commentCol = await getCommentCollection(chain);
  const comment = await commentCol.findOne({ _id: commentObjId });
  if (!comment) {
    throw new HttpError(400, "Comment does not exists");
  }

  const businessDb = await getBusinessDb(chain);
  const reactions = await businessDb.lookupMany({
    from: "reaction",
    for: comment,
    as: "reactions",
    localField: "_id",
    foreignField: "comment",
  });

  await lookupUser([
    { for: comment, localField: "author" },
    { for: reactions, localField: "user" },
  ]);

  return comment;
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
      post: postObjId,
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
    post: postObjId,
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

module.exports = {
  createPost,
  postComment,
  getPostsByChain,
  getPostById,
  getComments,
  updateComment,
  setCommentReaction,
  unsetCommentReaction,
  updatePost,
  getComment,
  setPostReaction,
  unsetPostReaction,
};
