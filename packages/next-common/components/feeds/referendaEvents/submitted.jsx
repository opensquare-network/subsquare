import AddressUser from "next-common/components/user/addressUser";
import Link from "next-common/components/link";
import tw from "tailwind-styled-components";
import Tooltip from "next-common/components/tooltip";
import LoadableFellowshipReferendumTitle from "next-common/components/feeds/loadableFellowshipReferendumTitle";
const Label = tw.span`text-textSecondary`;

export default function FeedsVotedEvent({ feed, showUserInfo = true }) {
  const { args: { who, referendumIndex } = {} } = feed || {};

  return (
    <>
      <span className="text-textPrimary">
        {showUserInfo && <AddressUser key={who} add={who} noTooltip />}
      </span>
      <Label>Submitted decision deposit for referendum</Label>
      <Tooltip
        content={
          <LoadableFellowshipReferendumTitle
            referendumIndex={referendumIndex}
          />
        }
      >
        <Link
          className="truncate cursor-pointer hover:underline"
          href={`/fellowship/referenda/${referendumIndex}`}
        >
          #{referendumIndex}
        </Link>
      </Tooltip>
    </>
  );
}
