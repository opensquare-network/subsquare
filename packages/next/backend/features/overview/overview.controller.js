const NodeCache = require( "node-cache" );
const discussionPostService = require("../../services/post.service")("post");
const tipPostService = require("../../services/tip.service");
const treasuryProposalPostService = require("../../services/treasury-proposal.service");
const bountyPostService = require("../../services/bounty.service");
const motionService = require("../../services/motion.service");
const externalProposalPostService = require("../../services/external-proposal.service");
const publicProposalPostService = require("../../services/public-proposal.service");
const referendumPostService = require("../../services/referendum.service");
const techCommMotionService = require("../../services/tech-comm-motion.service");
const financialMotionService = require("../../services/financial-motion.service");

const myCache = new NodeCache( { stdTTL: 30, checkperiod: 36 } );

async function getOverview(ctx) {
  const cachedOverview = myCache.get(`overview`);
  if (cachedOverview) {
    ctx.body = cachedOverview;
    return;
  }

  const [
    discussions,
    tips,
    treasuryProposals,
    bounties,
    motions,
    externals,
    publicProposals,
    referendums,
    techCommMotions,
    financialMotions,
  ] = await Promise.all([
    discussionPostService.getPostsOverview(),
    tipPostService.getActivePostsOverview(),
    treasuryProposalPostService.getActivePostsOverview(),
    bountyPostService.getActivePostsOverview(),
    motionService.getActiveMotionsOverview(),
    externalProposalPostService.getActivePostsOverview(),
    publicProposalPostService.getActivePostsOverview(),
    referendumPostService.getActivePostsOverview(),
    techCommMotionService.getActiveMotionsOverview(),
    financialMotionService.getActiveMotionsOverview(),
  ]);

  const overview = {
    discussions,
    treasury: {
      tips,
      proposals: treasuryProposals,
      bounties,
    },
    democracy: {
      proposals: publicProposals,
      referendums,
      externals,
    },
    council: {
      motions,
    },
    techComm: {
      motions: techCommMotions,
    },
    financialCouncil: {
      motions: financialMotions,
    }
  };

  myCache.set(`overview`, overview, 30);

  ctx.body = overview;
}

module.exports = {
  getOverview,
};
