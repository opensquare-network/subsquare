const aliMail = require("./alimail.service");
const templates = require("../templates");

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

  sendCommentMentionEmail({
    email,
    chain,
    postUid,
    content,
    contentType,
    commentPosition,
    author,
    mentionedUser,
  }) {
    const text = templates.commentMention({
      author,
      mentionedUser,
      chain,
      postUid,
      commentPosition,
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
