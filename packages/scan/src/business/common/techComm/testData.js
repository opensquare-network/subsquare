const testTechCommProposal = {
  callIndex: "0x3c02",
  section: "authority",
  method: "fastTrackScheduledDispatch",
  args: [
    {
      name: "initialOrigin",
      type: "PalletsOrigin",
      value: {
        authority: {
          delay: 50400,
          origin: {
            generalCouncil: {
              members: [5, 6],
            },
          },
        },
      },
    },
    {
      name: "taskId",
      type: "ScheduleTaskIndex",
      value: 2,
    },
    {
      name: "when",
      type: "DispatchTime",
      value: {
        after: 1,
      },
    },
  ],
};

module.exports = {
  testTechCommProposal,
};
