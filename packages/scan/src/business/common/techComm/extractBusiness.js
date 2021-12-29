const {
  getDemocracyExternalUnFinished,
} = require("../../../mongo/service/onchain/democracyExternal");
const {
  business: {
    consts: { Modules, DemocracyMethods },
    handleWrappedCall,
  },
} = require("@subsquare/scan-common");

async function extractTechCommMotionBusiness(
  proposalCall,
  signer,
  indexer,
  events
) {
  const externalProposals = [];

  await handleWrappedCall(
    proposalCall,
    signer,
    indexer,
    events,
    async (call) => {
      const { section, method, args } = call;
      if (Modules.Democracy !== section) {
        return;
      }

      if (
        ![DemocracyMethods.fastTrack, DemocracyMethods.vetoExternal].includes(
          method
        )
      ) {
        return;
      }

      const hash = args[0].toJSON();
      const external = await getDemocracyExternalUnFinished(hash);
      externalProposals.push({
        hash,
        method,
        indexer: external?.indexer,
      });
    }
  );

  return {
    externalProposals,
  };
}

module.exports = {
  extractTechCommMotionBusiness,
};
