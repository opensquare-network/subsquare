import CellActions from "../cellActions";

export const colActions = {
  name: "",
  style: { textAlign: "right", width: "80px", minWidth: "80px" },
  render: (item) => <CellActions asset={item} />,
};
