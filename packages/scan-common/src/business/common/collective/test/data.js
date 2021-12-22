const ksmTargetCall = {
  callIndex: "0x1202",
  section: "treasury",
  method: "approveProposal",
  args: [
    {
      name: "proposalId",
      type: "Compact<ProposalIndex>",
      value: 0,
    },
  ],
};

const dotMotionCallByProxy = {
  callIndex: "0x1301",
  section: "treasury",
  method: "rejectProposal",
  args: [
    {
      name: "proposalId",
      type: "Compact<ProposalIndex>",
      value: 33,
    },
  ],
};

module.exports = {
  ksmTargetCall,
  dotMotionCallByProxy,
};
