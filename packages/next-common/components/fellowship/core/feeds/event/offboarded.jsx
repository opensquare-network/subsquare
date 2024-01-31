import AddressUser from "next-common/components/user/addressUser";

export default function FellowshipCoreFeedsOffboardedEvent({ feed }) {
  return (
    <>
      <AddressUser key={feed?.args?.who} add={feed?.args?.who} noTooltip />
    </>
  );
}
