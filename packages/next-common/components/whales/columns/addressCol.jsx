import AddressUserWithDVTag from "next-common/components/user/addressUserWithDV";

export const addressCol = {
  name: "Address",
  className: "min-w-[160px]",
  cellRender(data) {
    return (
      <AddressUserWithDVTag add={data.address} maxWidth={160} linkToVotesPage />
    );
  },
};
