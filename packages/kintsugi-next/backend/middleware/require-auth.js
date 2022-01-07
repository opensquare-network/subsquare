const jwtService = require("../services/jwt.service");
const { HttpError } = require("../exc");

async function requireAuth(ctx, next) {
  let token = null;

  const authorization = ctx.request.headers.authorization;
  if (authorization) {
    const match = authorization.match(/^Bearer (.*)$/);
    if (!match) {
      throw new HttpError(400, "Incorrect authorization header.");
    }
    [, token] = match;
  } else {
    token = ctx.cookies.get("auth-token");
  }

  if (!token) {
    throw new HttpError(401, "Please make sure you are logged in");
  }

  const user = await jwtService.validate(token);
  ctx.user = user;

  await next();
}

module.exports = requireAuth;
