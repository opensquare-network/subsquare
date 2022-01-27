const {
  updateTreasuryProposal,
} = require("../../../../mongo/service/onchain/treasuryProposal");
const {
  insertDemocracyPublicProposal,
} = require("../../../../mongo/service/onchain/democracyPublicProposal");
const {
  insertDemocracyPostByProposal,
} = require("../../../../mongo/service/business/democracy");
const {
  business: {
    consts: { DemocracyPublicProposalEvents, TimelineItemTypes },
    getPublicProposalFromStorage,
    getPublicProposalDeposit,
    handleWrappedCall,
    isTreasuryProposalMotionCall,
  },
  chain: { findBlockApi },
  log: { busLogger },
} = require("@subsquare/scan-common");
const { hexToU8a } = require("@polkadot/util");

async function extractBusiness(hash, proposer, indexer, events) {
  const treasuryProposals = [];
  const blockApi = await findBlockApi(indexer.blockHash);
  const raw = await blockApi.query.democracy.preimages(hash);
  if (!raw.isSome) {
    return { treasuryProposals };
  }

  const availableImage = raw.unwrap().asAvailable.toJSON();
  try {
    const call = blockApi.registry.createType(
      "Proposal",
      hexToU8a(availableImage.data)
    );

    await handleWrappedCall(call, proposer, indexer, events, async (call) => {
      const { section, method, args } = call;
      if (isTreasuryProposalMotionCall(section, method)) {
        const treasuryProposalIndex = args[0].toJSON();
        treasuryProposals.push({
          index: treasuryProposalIndex,
          method,
        });
      }
    });
  } catch (e) {
    busLogger.error(`can not parse public proposal at ${indexer.blockHeight}`);
  }

  return { treasuryProposals };
}

async function saveNewPublicProposal(event, indexer, extrinsic, events) {
  const eventData = event.data.toJSON();
  const [proposalIndex] = eventData;
  const [, hash, proposer] = await getPublicProposalFromStorage(
    proposalIndex,
    indexer
  );
  const deposit = await getPublicProposalDeposit(proposalIndex, indexer);
  const authors = [...new Set([proposer, extrinsic.signer.toString()])];

  const { treasuryProposals } = await extractBusiness(
    hash,
    proposer,
    indexer,
    events
  );

  const state = {
    indexer,
    state: DemocracyPublicProposalEvents.Proposed,
    data: eventData,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: DemocracyPublicProposalEvents.Proposed,
    args: {
      index: proposalIndex,
      hash,
      proposer,
    },
    indexer,
    isFinal: false,
  };

  const obj = {
    indexer,
    proposalIndex,
    hash,
    authors,
    proposer,
    deposit,
    state,
    timeline: [timelineItem],
    techCommMotions: [],
    treasuryProposals,
  };

  await insertDemocracyPublicProposal(obj);
  await insertDemocracyPostByProposal(proposalIndex, indexer, proposer);

  for (const { index: treasuryProposalIndex, method } of treasuryProposals) {
    await updateTreasuryProposal(treasuryProposalIndex, null, null, {
      index: proposalIndex,
      hash,
      indexer,
      method,
    });
  }
}

module.exports = {
  saveNewPublicProposal,
};
