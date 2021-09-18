const NodeCache = require( "node-cache" );
const discussionPostService = require("../../services/post.service")("post");
const tipPostService = require("../../services/tip.service");
const treasuryProposalPostService = require("../../services/treasury-proposal.service");
const motionService = require("../../services/motion.service");
const externalProposalPostService = require("../../services/external-proposal.service");
const publicProposalPostService = require("../../services/public-proposal.service");
const referendumPostService = require("../../services/referendum.service");
const techCommMotionService = require("../../services/tech-comm-motion.service");

const myCache = new NodeCache( { stdTTL: 30, checkperiod: 36 } );

async function getOverview(ctx) {
  const { chain } = ctx.params;

  const cachedOverview = myCache.get(`${chain}/overview`);
  if (cachedOverview) {
    ctx.body = cachedOverview;
    return;
  }

  const [
    discussions,
    tips,
    treasuryProposals,
    motions,
    externals,
    publicProposals,
    referendums,
    techCommMotions,
  ] = await Promise.all([
    discussionPostService.getPostsOverview(chain),
    tipPostService.getActivePostsOverview(chain),
    treasuryProposalPostService.getActivePostsOverview(chain),
    motionService.getActiveMotionsOverview(chain),
    externalProposalPostService.getActivePostsOverview(chain),
    publicProposalPostService.getActivePostsOverview(chain),
    referendumPostService.getActivePostsOverview(chain),
    techCommMotionService.getActiveMotionsOverview(chain),
  ]);

  const overview = {
    discussions,
    treasury: {
      tips,
      proposals: treasuryProposals,
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
    }
  };

  myCache.set(`${chain}/overview`, overview, 30);

  ctx.body = overview;
}

module.exports = {
  getOverview,
};
