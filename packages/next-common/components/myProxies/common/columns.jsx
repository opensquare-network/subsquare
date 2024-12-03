import RemoveProxy from "./operations/removeProxy";

export * from "next-common/components/profile/proxy/common/columns";

export const removeColumn = {
  name: "",
  render: (data) => <RemoveProxy data={data} />,
};
