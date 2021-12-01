const { extractBusinessFields } = require("../proposed");
const ksmTargetCall = {
  callIndex: "0x1202",
  section: "treasury",
  method: "approveProposal",
  args: [
    {
      name: "proposal_id",
      type: "Compact<ProposalIndex>",
      value: 0,
    },
  ],
};

test("test extractBusinessFields works", () => {
  expect(extractBusinessFields(ksmTargetCall)).toEqual({});
});
