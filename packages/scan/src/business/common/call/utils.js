const {
  Modules,
  TreasuryProposalMethods,
  BountyMethods,
} = require("../constants");

function isTreasuryProposalMotionCall(section, method) {
  return (
    Modules.Treasury === section &&
    [
      TreasuryProposalMethods.approveProposal,
      TreasuryProposalMethods.rejectProposal,
    ].includes(method)
  );
}

function isBountyMotionCall(section, method) {
  return (
    [Modules.Treasury, Modules.Bounties].includes(section) &&
    [
      BountyMethods.approveBounty,
      BountyMethods.proposeCurator,
      BountyMethods.unassignCurator,
      BountyMethods.closeBounty,
    ].includes(method)
  );
}

function isStateChangeBountyMotionCall(method) {
  return [BountyMethods.approveBounty, BountyMethods.closeBounty].includes(
    method
  );
}

module.exports = {
  isTreasuryProposalMotionCall,
  isBountyMotionCall,
  isStateChangeBountyMotionCall,
};
