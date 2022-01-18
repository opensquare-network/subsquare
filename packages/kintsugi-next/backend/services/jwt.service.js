const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const { getUserCollection } = require("../mongo/common");
const { HttpError } = require("../exc");
const { t } = require("./i18n.service");

const jwtSecretKey = process.env.JWT_SECRET_KEY || "";
if (!jwtSecretKey) {
  console.error(`Environment JWT_SECRET_KEY is not properly config.`)
  process.exit();
}

async function validate(accessToken) {
  let decoded;
  try {
    decoded = jwt.verify(accessToken, jwtSecretKey);
  } catch (e) {
    throw new HttpError(401, t(e.message));
  }

  const userCol = await getUserCollection();
  const user = await userCol.findOne({ _id: ObjectId(decoded.id) });

  if (!user) {
    throw new HttpError(401, "Current user is not exists");
  }

  return user;
}

function getSignedToken(user) {
  const content = {
    id: user._id,
    email: user.email,
    username: user.username,
    roles: user.roles,
    iat: Math.floor(Date.now() / 1000),
  };

  return jwt.sign(content, jwtSecretKey, { expiresIn: "7d" });
}

module.exports = {
  validate,
  getSignedToken,
}
