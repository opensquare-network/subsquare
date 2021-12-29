const { getCouncilName } = require("../../../common/motion/utils");
const {
  getCollectiveMotionCommonFields,
} = require("@subsquare/scan-common/src/business/collective/proposed");
const {
  insertMotionPost,
} = require("../../../../mongo/service/business/motion");
const { handleBusinessWhenMotionProposed } = require("./hooks/proposed");
const { insertMotion } = require("../../../../mongo/service/onchain/motion");
const {
  business: { extractCouncilMotionBusiness },
} = require("@subsquare/scan-common");

async function handleProposed(event, extrinsic, indexer, blockEvents) {
  const { common, rawProposal } = await getCollectiveMotionCommonFields(
    event,
    indexer,
    extrinsic,
    getCouncilName()
  );

  const { treasuryProposals, treasuryBounties, externalProposals } =
    await extractCouncilMotionBusiness(
      rawProposal,
      common.proposer,
      indexer,
      blockEvents
    );

  const obj = {
    ...common,
    treasuryProposals,
    treasuryBounties,
    externalProposals,
  };

  await insertMotion(obj);
  const { proposer, index, hash } = common;
  await insertMotionPost(indexer, hash, index, proposer);
  await handleBusinessWhenMotionProposed(
    obj,
    rawProposal,
    indexer,
    blockEvents
  );
}

module.exports = {
  handleProposed,
};
