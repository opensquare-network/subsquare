const aliMail = require("./alimail.service");
const templates = require("../templates");

const pageSize = 50;

class MailService {
  async sendResetPasswordEmail({ username, email, token }) {
    const text = templates.resetPassword({
      username,
      email,
      token,
      siteUrl: process.env.SITE_URL,
    });

    const msg = {
      html: text,
      subject: "Reset your account password",
      text,
      to: email,
    };

    try {
      await aliMail.sendMail(msg);
      return true;
    } catch (e) {
      console.error("sendResetPasswordEmail", e)
      return false;
    }
  }

  async sendVerificationEmail({ username, email, token }) {
    const text = templates.emailVerification({
      username,
      email,
      token,
      siteUrl: process.env.SITE_URL,
    });

    const msg = {
      html: text,
      subject: "Please verify your email",
      text,
      to: email,
    };

    try {
      await aliMail.sendMail(msg);
      return true;
    } catch (e) {
      console.error("sendVerificationEmail", e)
      return false;
    }
  }

  sendCommentThumbsupEmail({
    email,
    commentAuthor,
    postType,
    postUid,
    commentHeight,
    content,
    contentType,
    reactionUser,
  }) {
    const page = Math.ceil(commentHeight / pageSize);

    const text = templates.commentThumbsup({
      commentAuthor,
      postType,
      postUid,
      commentHeight,
      reactionUser,
      page, pageSize,
      siteUrl: process.env.SITE_URL,
    });

    const msg = {
      html: text,
      subject: "Someone support your comment",
      text,
      to: email,
    };

    aliMail.sendMail(msg).catch((e) =>
      console.error("Comment thumbs up email not sent", e)
    );
  }

  sendPostThumbsupEmail({
    email,
    postAuthor,
    postType,
    postUid,
    reactionUser,
  }) {
    const text = templates.postThumbsup({
      postAuthor,
      postType,
      postUid,
      reactionUser,
      siteUrl: process.env.SITE_URL,
    });

    const msg = {
      html: text,
      subject: "Someone support your post",
      text,
      to: email,
    };

    aliMail.sendMail(msg).catch((e) =>
      console.error("Post thumbs up email not sent", e)
    );
  }

  sendReplyEmail({
    email,
    replyToUser,
    postType,
    postUid,
    content,
    contentType,
    author,
    commentHeight,
  }) {
    const page = Math.ceil(commentHeight / pageSize);

    const text = templates.postReply({
      author,
      replyToUser,
      postType,
      postUid,
      commentHeight,
      page, pageSize,
      siteUrl: process.env.SITE_URL,
    });

    const msg = {
      html: text,
      subject: "Someone reply your post",
      text,
      to: email,
    };

    aliMail.sendMail(msg).catch((e) =>
      console.error("Reply Email not sent", e)
    );
  }

  sendCommentMentionEmail({
    email,
    postType,
    postUid,
    content,
    contentType,
    commentHeight,
    author,
    mentionedUser,
  }) {
    const page = Math.ceil(commentHeight / pageSize);

    const text = templates.commentMention({
      author,
      mentionedUser,
      postType,
      postUid,
      commentHeight,
      page, pageSize,
      siteUrl: process.env.SITE_URL,
    });

    const msg = {
      html: text,
      subject: "Someone mention you in comment",
      text,
      to: email,
    };

    aliMail.sendMail(msg).catch((e) =>
      console.error("Comment metion Email not sent", e)
    );
  }

}

module.exports = new MailService();
