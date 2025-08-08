import AddressUser from "next-common/components/user/addressUser";

export const colFrom = {
  name: "From",
  className: "w-[212px]",
  style: { textAlign: "left" },
  render: (item) => <AddressUser key={item.from} add={item.from} />,
};
