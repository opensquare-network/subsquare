const { extractPage } = require("../../../utils");
const motionService = require("../../../services/tech-comm-motion.service");

async function getMotions(ctx) {
  const { chain } = ctx.params;

  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 1) {
    ctx.status = 400;
    return;
  }

  ctx.body = await motionService.getMotionsByChain(chain, page, pageSize);
}

async function getMotionById(ctx) {
  const { chain, motionId } = ctx.params;

  ctx.body = await motionService.getMotionById(chain, motionId);
}

module.exports = {
  getMotions,
  getMotionById,
};
