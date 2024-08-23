import AddressUser from "next-common/components/user/addressUser";

export function useAssetsTransfersHistoryToColumn() {
  return {
    name: "To",
    style: { textAlign: "left", minWidth: "212px" },
    render: (item) => <AddressUser key={item.to} add={item.to} />,
  };
}
