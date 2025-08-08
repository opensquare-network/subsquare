import AddressUser from "next-common/components/user/addressUser";

export const colTo = {
  name: "To",
  className: "w-[212px]",
  style: { textAlign: "left" },
  render: (item) => <AddressUser key={item.to} add={item.to} />,
};
