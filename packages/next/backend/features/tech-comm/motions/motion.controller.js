const { extractPage } = require("../../../utils");
const motionService = require("../../../services/tech-comm-motion.service");

async function getMotions(ctx) {
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 1) {
    ctx.status = 400;
    return;
  }

  ctx.body = await motionService.getMotionsByChain(page, pageSize);
}

async function getMotionById(ctx) {
  const { motionId } = ctx.params;

  ctx.body = await motionService.getMotionById(motionId);
}

module.exports = {
  getMotions,
  getMotionById,
};
