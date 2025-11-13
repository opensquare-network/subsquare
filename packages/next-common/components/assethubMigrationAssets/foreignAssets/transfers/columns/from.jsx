import AddressUser from "next-common/components/user/addressUser";

export const colFrom = {
  name: "From",
  style: { textAlign: "left", minWidth: "212px" },
  render: (item) => (
    <AddressUser key={item.from} add={item.from} link="/assets" />
  ),
};
