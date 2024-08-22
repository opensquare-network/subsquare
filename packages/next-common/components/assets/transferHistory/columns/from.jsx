import AddressUser from "next-common/components/user/addressUser";

export function useAssetsTransfersHistoryFromColumn() {
  return {
    name: "From",
    style: { textAlign: "left", minWidth: "256px" },
    render: (item) => <AddressUser key={item.from} add={item.from} />,
  };
}
