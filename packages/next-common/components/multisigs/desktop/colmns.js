const columns = [
  {
    name: "When",
    style: { textAlign: "left", width: "120px", minWidth: "120px" },
    tooltip: "When the multisig was created",
  },
  {
    name: "Multisig Address",
    style: {
      textAlign: "left",
      width: "200px",
      minWidth: "200px",
      paddingRight: "16px",
    },
  },
  {
    name: "Call",
    style: { textAlign: "left", minWidth: "256px" },
    tooltip:
      "What will be executed after approved on behalf of the multisig address",
  },
  {
    name: "Approving",
    style: { textAlign: "left", width: "120px", minWidth: "120px" },
    tooltip: "Signing status",
  },
  {
    name: "Signatories",
    style: { textAlign: "left", width: "120px", minWidth: "120px" },
  },
  {
    name: "Status",
    style: { textAlign: "right", width: "160px", minWidth: "160px" },
  },
  {
    name: "",
    style: {
      width: 120,
      minWidth: 120,
    },
  },
];

export default columns;
