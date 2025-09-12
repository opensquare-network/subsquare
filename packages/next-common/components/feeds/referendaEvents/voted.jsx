import AddressUser from "next-common/components/user/addressUser";
import tw from "tailwind-styled-components";

const Label = tw.span`text-textSecondary`;

export default function FeedsVotedEvent({ feed, showUserInfo = true }) {
  const { args: { who, toRank } = {} } = feed || {};
  return (
    <>
      <span className="text-textPrimary">
        {showUserInfo && <AddressUser key={who} add={who} noTooltip />}
      </span>
      <Label>Voted</Label>
      <span></span>
    </>
  );
}
