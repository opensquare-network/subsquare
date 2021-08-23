const { HttpError } = require("../exc");

async function requireVerify(ctx, next) {
  if (ctx.user && !ctx.user.emailVerified) {
    throw new HttpError(
      403,
      "The account email address is not verified yet"
    );
  }

  await next();
}

module.exports = requireVerify;
