const aliMail = require("./alimail.service");
const templates = require("../templates");

const pageSize = 10;

class MailService {
  sendResetPasswordEmail({ username, email, token }) {
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

    aliMail.sendMail(msg).catch((e) =>
      console.error("Reset password Email not sent", e)
    );
  }

  sendVerificationEmail({ username, email, token }) {
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

    aliMail.sendMail(msg).catch((e) =>
      console.error("Verification Email not sent", e)
    );
  }

  sendCommentReactionEmail({
    email,
    commentAuthor,
    chain,
    postUid,
    commentHeight,
    content,
    contentType,
    reactionUser,
  }) {
    const page = parseInt(commentHeight / pageSize);

    const text = templates.commentReaction({
      commentAuthor,
      chain,
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
      console.error("Thumbs up email not sent", e)
    );
  }

  sendReplyEmail({
    email,
    replyToUser,
    chain,
    postUid,
    content,
    contentType,
    author,
    commentHeight,
  }) {
    const page = parseInt(commentHeight / pageSize);

    const text = templates.postReply({
      author,
      replyToUser,
      chain,
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
    chain,
    postUid,
    content,
    contentType,
    commentHeight,
    author,
    mentionedUser,
  }) {
    const page = parseInt(commentHeight / pageSize);

    const text = templates.commentMention({
      author,
      mentionedUser,
      chain,
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
