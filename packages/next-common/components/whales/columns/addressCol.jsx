import AddressUser from "next-common/components/user/addressUser";

export const addressCol = {
  name: "Address",
  className: "min-w-[160px]",
  cellRender(data) {
    return <AddressUser linkToVotesPage add={data.address} />;
  },
};
