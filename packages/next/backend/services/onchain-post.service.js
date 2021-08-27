const { ObjectId } = require("mongodb");
const { safeHtml } = require("../utils/post");
const { PostTitleLengthLimitation } = require("../constants");
const {
  getDb: getBusinessDb
} = require("../mongo/business");
const { HttpError } = require("../exc");
const { ContentType } = require("../constants");

function createService(postType) {

  async function getPostCollection(chain) {
    const db = await getBusinessDb(chain);
    return db.getCollection(postType);
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

  return {
    updatePost,
  };
}

module.exports = createService;
