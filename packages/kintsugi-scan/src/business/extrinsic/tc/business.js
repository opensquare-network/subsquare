const {
  business: {
    consts: { Modules, DemocracyMethods },
    handleWrappedCall,
  },
} = require("@subsquare/scan-common");

async function extractPublicProposals(proposalCall, signer, indexer, events) {
  const publicProposals = [];

  await handleWrappedCall(
    proposalCall,
    signer,
    indexer,
    events,
    async (call) => {
      const { section, method, args } = call;
      if (
        Modules.Democracy !== section ||
        DemocracyMethods.fastTrack !== method
      ) {
        return;
      }

      const proposalIndex = args[0].toJSON();
      publicProposals.push({
        proposalIndex,
      });
    }
  );

  return {
    publicProposals,
  };
}

module.exports = {
  extractPublicProposals,
};
