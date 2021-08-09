const { randomBytes } = require("crypto");
const argon2 = require("argon2");
const validator = require("validator");
const {
  getUserCollection,
} = require("../../mongo/common");
const { HttpError } = require("../../exc");
const mailService = require("../../services/mail.service");

class UserController {

  async getUserProfile(ctx) {
    const user = ctx.request.user;

    ctx.body = {
      username: user.username,
      email: user.email,
      emailVerified: user.emailVerified,
    };
  }

  async changePassword(ctx) {
    const { oldPassword, newPassword } = ctx.request.body;
    const user = ctx.request.user;

    if (!oldPassword) {
      throw new HttpError(400, {
        oldPassword: ["Old password must be provided."],
      });
    }

    if (!newPassword) {
      throw new HttpError(400, {
        newPassword: ["New password must be provided."],
      });
    }

    if (newPassword === oldPassword) {
      throw new HttpError(400, {
        newPassword: ["The new password must be different from the old one."],
      });
    }

    const correct = await argon2.verify(user.hashedPassword, oldPassword);
    if (!correct) {
      throw new HttpError(401, { oldPassword: ["Incorrect old password."] });
    }

    const hashedPassword = await argon2.hash(newPassword);

    const userCol = await getUserCollection();
    const result = await userCol.updateOne(
      { _id: user._id },
      {
        $set: {
          hashedPassword,
        },
      }
    );

    if (!result.result.ok) {
      throw new HttpError(500, "DB error: change password.");
    }

    if (result.result.nModified === 0) {
      throw new HttpError(500, "Failed to change password.");
    }

    ctx.body = true;
  }

  async changeEmail(ctx) {
    const { password, newEmail } = ctx.request.body;
    const user = ctx.request.user;

    if (!password) {
      throw new HttpError(400, { password: ["Password must be provided."] });
    }

    if (newEmail === user.email) {
      throw new HttpError(400, {
        newEmail: ["The new email address must be different from the old one."],
      });
    }

    if (!validator.isEmail(newEmail)) {
      throw new HttpError(400, { newEmail: ["Invalid email"] });
    }

    const correct = await argon2.verify(user.hashedPassword, password);
    if (!correct) {
      throw new HttpError(401, { password: ["Incorrect password."] });
    }

    const userCol = await getUserCollection();

    const existing = await userCol.findOne({ email: newEmail });
    if (existing) {
      throw new HttpError(409, {
        newEmail: ["The email address has been used by another account."],
      });
    }

    const verifyToken = randomBytes(12).toString("hex");
    const result = await userCol.updateOne(
      { _id: user._id },
      {
        $set: {
          email: newEmail,
          emailVerified: false,
          verifyToken,
        },
      }
    );

    if (!result.result.ok) {
      throw new HttpError(500, "DB error: change email.");
    }

    if (result.result.nModified === 0) {
      throw new HttpError(500, "Failed to change email.");
    }

    mailService.sendVerificationEmail({
      username: user.username,
      email: newEmail,
      token: verifyToken,
    });

    ctx.body = true;
  }

  async deleteAccount(ctx) {
    const { password } = ctx.request.body;
    const user = ctx.request.user;

    if (!password) {
      throw new HttpError(400, { password: ["Password must be provided."] });
    }

    const correct = await argon2.verify(user.hashedPassword, password);
    if (!correct) {
      throw new HttpError(401, { password: ["Incorrect password."] });
    }

    const userCol = await getUserCollection();
    const result = await userCol.deleteOne({ _id: user._id });

    if (!result.result.ok) {
      throw new HttpError(500, "DB error: delete account.");
    }

    if (result.result.n === 0) {
      throw new HttpError(500, "Failed to delete account.");
    }

    ctx.body = true;
  }

  async resendVerifyEmail(ctx) {
    const user = ctx.request.user;

    if (user.emailVerified) {
      throw new HttpError(400, "Email is already verified.");
    }

    mailService.sendVerificationEmail({
      username: user.username,
      email: user.email,
      token: user.verifyToken,
    });

    ctx.body = true;
  }
}

module.exports = new UserController();
