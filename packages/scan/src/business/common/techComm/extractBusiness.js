const { Modules, DemocracyMethods } = require("../constants");
const { handleWrappedCall } = require("../call/handle");

async function extractTechCommMotionBusiness(
  proposalCall,
  signer,
  indexer,
  events
) {
  const externalProposals = [];

  await handleWrappedCall(proposalCall, signer, indexer, events, (call) => {
    const { section, method, args } = call;
    if (Modules.Democracy !== section) {
      return;
    }

    if (
      [DemocracyMethods.fastTrack, DemocracyMethods.vetoExternal].includes(
        method
      )
    ) {
      const hash = args[0].toJSON();
      externalProposals.push({
        hash,
        method,
      });
    }
  });

  return {
    externalProposals,
  };
}

module.exports = {
  extractTechCommMotionBusiness,
};
