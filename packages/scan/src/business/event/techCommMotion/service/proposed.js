const {
  insertTechCommMotionPost,
} = require("../../../../mongo/service/business/techCommMotion");
const {
  extractTechCommMotionBusiness,
} = require("../../../common/techComm/extractBusiness");
const {
  handleBusinessWhenTechCommMotionProposed,
} = require("./hooks/proposed");
const {
  insertTechCommMotion,
} = require("../../../../mongo/service/onchain/techCommMotion");
const {
  business: {
    consts: { Modules },
    getCollectiveMotionCommonFields,
  },
} = require("@subsquare/scan-common");

async function handleProposed(event, extrinsic, indexer, extrinsicEvents) {
  const { common, rawProposal } = await getCollectiveMotionCommonFields(
    event,
    indexer,
    extrinsic,
    Modules.TechnicalCommittee
  );

  const { externalProposals } = await extractTechCommMotionBusiness(
    rawProposal,
    common.proposer,
    indexer,
    extrinsicEvents
  );

  const obj = {
    ...common,
    externalProposals,
  };

  await handleBusinessWhenTechCommMotionProposed(obj, indexer);
  await insertTechCommMotion(obj);
  const { proposer, index, hash } = common;
  await insertTechCommMotionPost(indexer, hash, index, proposer);
}

module.exports = {
  handleProposed,
};
