import RemoveProxy from "../operations/removeProxy";

export * from "next-common/components/profile/proxy/common/columns";

export const removeColumn = {
  name: "",
  className: "text-right w-20",
  render: (data) => <RemoveProxy data={data} />,
};
