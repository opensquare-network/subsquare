const tipPostService = require("../../services/tip.service");
const treasuryProposalPostService = require("../../services/treasury-proposal.service");
const motionService = require("../../services/motion.service");
const externalProposalPostService = require("../../services/democracy.service")("democracyExternal", "proposalHash", "externalProposalHash");
const publicProposalPostService = require("../../services/democracy.service")("democracyPublicProposal", "proposalIndex");
const referendumPostService = require("../../services/democracy.service")("democracyReferendum", "referendumIndex");
const techCommMotionService = require("../../services/tech-comm-motion.service");

async function getOverview(ctx) {
  const { chain } = ctx.params;

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

  ctx.body = {
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
}

module.exports = {
  getOverview,
};
