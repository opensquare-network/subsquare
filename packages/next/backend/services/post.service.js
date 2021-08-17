const { ObjectId } = require("mongodb");
const xss = require("xss");
const { PostTitleLengthLimitation } = require("../constants");
const { nextPostUid } = require("./status.service");
const { getPostCollection, getCommentCollection } = require("../mongo/common");
const { HttpError } = require("../exc");
const { ContentType } = require("../constants");
const { lookupOne, lookupCount } = require("../utils/query");
const { md5 } = require("../utils");

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

  if (!author.emailVerified) {
    throw new HttpError(
      403,
      "The account email address is not verified yet"
    );
  }

  const postUid = await nextPostUid();

  const now = new Date();

  const postCol = await getPostCollection();
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

async function postComment(
  postId,
  content,
  contentType,
  author,
) {
  const postObjId = ObjectId(postId);

  if (!author.emailVerified) {
    throw new HttpError(
      403,
      "The account email address is not verified yet"
    );
  }

  const postCol = await getPostCollection();
  const post = await postCol.findOne({_id: postObjId});
  if (!post) {
    throw new HttpError(400, "Post not found.");
  }

  const commentCol = await getCommentCollection();
  const height = await commentCol.countDocuments({ post: postObjId });

  const now = new Date();

  const result = await commentCol.insertOne(
    {
      post: postObjId,
      content: contentType === ContentType.Html ? safeHtml(content) : content,
      contentType,
      author: author._id,
      height: height + 1,
      createdAt: now,
      updatedAt: now,
    },
  );

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

  return newCommentId;
}

async function getPostsByChain(chain, page, pageSize) {
  const postCol = await getPostCollection();
  const total = await postCol.countDocuments({ chain });

  if (page === "last") {
    const totalPages = Math.ceil(total / pageSize);
    page = totalPages;
  }

  const posts = await postCol.find({ chain })
    .sort({ lastActivityAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .toArray();

  await Promise.all([
    lookupOne(posts, {
      from: "user",
      localField: "author",
      foreignField: "_id",
      projection: {
        username: 1,
        email: 1
      },
      map: (item) => ({
        username: item.username,
        emailMd5: md5(item.email.trim().toLocaleLowerCase()),
      }),
    }),
    lookupCount(posts, {
      from: "comment",
      localField: "_id",
      foreignField: "post",
      as: "commentsCount",
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
  const q = {};
  if (ObjectId.isValid(postId)) {
    q._id = ObjectId(postId);
  } else {
    q.postUid = postId;
  }

  const postCol = await getPostCollection();
  const post = await postCol.findOne(q);
  await lookupOne(post, {
    from: "user",
    localField: "author",
    foreignField: "_id",
    projection: {
      email: 1,
      username: 1,
    }
  });

  return post;
}

async function getComments(postId, page, pageSize) {
  const q = { post: ObjectId(postId) };

  const commentCol = await getCommentCollection();
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

  await lookupOne(comments, {
    from: "user",
    localField: "author",
    foreignField: "_id",
    projection: {
      email: 1,
      username: 1,
    }
  });

  return {
    items: comments,
    total,
    page,
    pageSize,
  };
}

async function updateComment(
  commentId,
  content,
  contentType,
  author,
) {
  const commentObjId = ObjectId(commentId);
  const commentCol = await getCommentCollection();
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

module.exports = {
  createPost,
  postComment,
  getPostsByChain,
  getPostById,
  getComments,
  updateComment,
};
