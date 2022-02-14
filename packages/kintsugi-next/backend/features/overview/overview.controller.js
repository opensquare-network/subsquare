const NodeCache = require("node-cache");
const discussionPostService =
  require("@subsquare/backend-common/services/post.service")("post");
const treasuryProposalPostService = require("../../services/treasury-proposal.service");
const publicProposalPostService = require("../../services/public-proposal.service");
const referendumPostService = require("../../services/referendum.service");
const techCommMotionService = require("../../services/tech-comm-motion.service");

const myCache = new NodeCache({ stdTTL: 30, checkperiod: 36 });

async function getOverview(ctx) {
  const cachedOverview = myCache.get(`overview`);
  if (cachedOverview) {
    ctx.body = cachedOverview;
    return;
  }

  const [
    discussions,
    treasuryProposals,
    publicProposals,
    referendums,
    techCommMotions,
  ] = await Promise.all([
    discussionPostService.getPostsOverview(),
    treasuryProposalPostService.getActivePostsOverview(),
    publicProposalPostService.getActivePostsOverview(),
    referendumPostService.getActivePostsOverview(),
    techCommMotionService.getActiveMotionsOverview(),
  ]);

  const overview = {
    discussions,
    treasury: {
      proposals: treasuryProposals,
    },
    democracy: {
      proposals: publicProposals,
      referendums,
    },
    techComm: {
      motions: techCommMotions,
    },
  };

  myCache.set(`overview`, overview, 30);

  ctx.body = overview;
}

module.exports = {
  getOverview,
};
