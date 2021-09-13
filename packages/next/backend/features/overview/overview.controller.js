const NodeCache = require( "node-cache" );
const tipPostService = require("../../services/tip.service");
const treasuryProposalPostService = require("../../services/treasury-proposal.service");
const motionService = require("../../services/motion.service");
const externalProposalPostService = require("../../services/democracy.service")("democracyExternal", "proposalHash", "externalProposalHash");
const publicProposalPostService = require("../../services/democracy.service")("democracyPublicProposal", "proposalIndex");
const referendumPostService = require("../../services/democracy.service")("democracyReferendum", "referendumIndex");
const techCommMotionService = require("../../services/tech-comm-motion.service");

const myCache = new NodeCache( { stdTTL: 30, checkperiod: 36 } );

async function getOverview(ctx) {
  const { chain } = ctx.params;

  const cachedOverview = myCache.get("overview");
  if (cachedOverview) {
    ctx.body = cachedOverview;
    return;
  }

  const [
    tips,
    treasuryProposals,
    motions,
    externals,
    publicProposals,
    referendums,
    techCommMotions,
  ] = await Promise.all([
    tipPostService.getActivePostsOverview(chain),
    treasuryProposalPostService.getActivePostsOverview(chain),
    motionService.getActiveMotionsOverview(chain),
    externalProposalPostService.getActivePostsOverview(chain),
    publicProposalPostService.getActivePostsOverview(chain),
    referendumPostService.getActivePostsOverview(chain),
    techCommMotionService.getActiveMotionsOverview(chain),
  ]);

  const overview = {
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

  myCache.set("overview", overview, 30);

  ctx.body = overview;
}

module.exports = {
  getOverview,
};
