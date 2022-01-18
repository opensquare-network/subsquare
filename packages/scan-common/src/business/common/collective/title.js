const isNil = require("lodash.isnil");

function getMotionPostDefaultTitle(hash, motionIndex) {
  if (isNil(motionIndex)) {
    const prefix = hash.slice(0, 6);
    const length = hash.length;
    const suffix = hash.slice(length - 4, length);
    return `Untitled - motion ${prefix}...${suffix}`;
  }

  return `Untitled - motion #${motionIndex}`;
}

module.exports = {
  getMotionPostDefaultTitle,
};
