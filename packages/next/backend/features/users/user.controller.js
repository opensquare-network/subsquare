const { ObjectId } = require("mongodb");
const { randomBytes } = require("crypto");
const argon2 = require("argon2");
const validator = require("validator");
const {
  getUserCollection, getAttemptCollection,
} = require("../../mongo/common");
const { HttpError } = require("../../exc");
const mailService = require("../../services/mail.service");
const { validateAddress, isValidSignature } = require("../../utils");
const { SupportChains } = require("../../constants");

async function getUserProfile(ctx) {
  const user = ctx.user;

  ctx.body = {
    username: user.username,
    email: user.email,
    emailVerified: user.emailVerified,
    notification: {
      reply: user.notification?.reply ?? true,
      mention: user.notification?.mention ?? true,
      thumbsUp: user.notification?.thumbsUp ?? true,
    },
    addresses: SupportChains.reduce((addresses, chain) => {
      const address = user[`${chain}Address`];
      if (address) {
        addresses.push({
          chain,
          address,
        });
      }
      return addresses;
    }, []),
  };
}

async function changePassword(ctx) {
  const { oldPassword, newPassword } = ctx.request.body;
  const user = ctx.user;

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

async function changeEmail(ctx) {
  const { password, newEmail } = ctx.request.body;
  const user = ctx.user;

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

  const isSent = await mailService.sendVerificationEmail({
    username: user.username,
    email: newEmail,
    token: verifyToken,
  });

  ctx.body = isSent;
}

async function deleteAccount(ctx) {
  const { password } = ctx.request.body;
  const user = ctx.user;

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

async function resendVerifyEmail(ctx) {
  const user = ctx.user;

  if (user.emailVerified) {
    throw new HttpError(400, "Email is already verified.");
  }

  const isSent = await mailService.sendVerificationEmail({
    username: user.username,
    email: user.email,
    token: user.verifyToken,
  });

  ctx.body = isSent;
}

async function linkAddressStart(ctx) {
  const { chain, address } = ctx.params;
  const user = ctx.user;

  validateAddress(address, chain);

  const attemptCol = await getAttemptCollection();
  const result = await attemptCol.insertOne({
    type: "linkAddress",
    userId: user._id,
    address,
    chain,
    challenge: randomBytes(12).toString("hex"),
    createdAt: new Date(),
  });

  if (!result.result.ok) {
    throw new HttpError(500, "Db error: link address start.");
  }

  const attempt = result.ops[0];

  ctx.body = {
    attemptId: attempt._id,
    challenge: attempt.challenge,
  };
}

async function linkAddressConfirm(ctx) {
  const { attemptId } = ctx.params;
  const { challengeAnswer } = ctx.request.body;
  const user = ctx.user;

  const attemptCol = await getAttemptCollection();
  const attempt = await attemptCol.findOne({
    _id: ObjectId(attemptId),
    type: "linkAddress",
    userId: user._id,
  });

  if (!attempt) {
    throw new HttpError(400, "Incorrect link address attempt id");
  }

  const { chain, address, userId, challenge } = attempt;

  const addressName = `${chain}Address`;

  if (!challengeAnswer) {
    throw new HttpError(400, {
      challengeAnswer: ["Challenge answer is not provided."],
    });
  }

  const success = isValidSignature(challenge, challengeAnswer, address);
  if (!success) {
    throw new HttpError(400, {
      challengeAnswer: ["Incorrect challenge answer."],
    });
  }

  if (user[addressName] === address) {
    throw new HttpError(400, {
      address: ["The address is already linked with this account."],
    });
  }

  if (user[addressName]) {
    throw new HttpError(
      400,
      `Only 1 ${chain} address is allow to be linked.`
    );
  }

  const userCol = await getUserCollection();
  const existing = await userCol.findOne({
    [addressName]: address,
    _id: { $ne: userId },
  });
  if (existing) {
    throw new HttpError(400, {
      address: ["The address is already used by another account."],
    });
  }

  const result = await userCol.updateOne(
    { _id: userId },
    {
      $set: {
        [addressName]: address,
      },
    }
  );

  if (!result.result.ok) {
    throw new HttpError(500, "Db error: save address.");
  }

  ctx.body = true;
}

async function unlinkAddress(ctx) {
  const { chain, address } = ctx.params;
  const user = ctx.user;

  validateAddress(address, chain);

  const addressName = `${chain}Address`;

  const userCol = await getUserCollection();
  const result = await userCol.updateOne(
    { _id: user._id },
    {
      $unset: { [addressName]: true },
    }
  );

  if (!result.result.ok) {
    throw new HttpError(500, "Db error, unlink address.");
  }

  if (result.result.nModified === 0) {
    throw new HttpError(500, "Failed to unlink address.");
  }

  ctx.body = true;
}

async function setUserNotification(ctx) {
  const { reply, mention, thumbsUp } = ctx.request.body;
  const user = ctx.user;

  const notification = {
    reply: reply ?? user.notification?.reply ?? true,
    mention: mention ?? user.notification?.mention ?? true,
    thumbsUp: thumbsUp ?? user.notification?.thumbsUp ?? true,
  };

  const userCol = await getUserCollection();
  const result = await userCol.updateOne(
    { _id: user._id },
    {
      $set: {
        notification,
      },
    }
  );

  if (!result.result.ok) {
    throw new HttpError(500, "Db error, update notification setting");
  }

  ctx.body = true;
}

module.exports = {
  getUserProfile,
  changePassword,
  changeEmail,
  resendVerifyEmail,
  deleteAccount,
  linkAddressStart,
  linkAddressConfirm,
  unlinkAddress,
  setUserNotification,
}