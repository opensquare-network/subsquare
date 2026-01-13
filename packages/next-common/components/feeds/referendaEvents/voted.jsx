import AddressUser from "next-common/components/user/addressUser";
import { SystemVoteAye, SystemVoteNay } from "@osn/icons/subsquare";
import Link from "next-common/components/link";
import tw from "tailwind-styled-components";
import Tooltip from "next-common/components/tooltip";
import LoadableFellowshipReferendumTitle from "next-common/components/feeds/loadableFellowshipReferendumTitle";
const Label = tw.span`text-textSecondary`;

export default function FeedsVotedEvent({ feed, showUserInfo = true }) {
  const { args: { who, referendumIndex, isAye } = {} } = feed || {};

  let vote;
  if (isAye) {
    vote = (
      <>
        <SystemVoteAye className="w-4 h-4" />
        <span className="text-green500">Aye</span>
      </>
    );
  } else {
    vote = (
      <>
        <SystemVoteNay className="w-4 h-4" />
        <span className="text-red500">Nay</span>
      </>
    );
  }

  return (
    <>
      <span className="text-textPrimary">
        {showUserInfo && <AddressUser key={who} add={who} noTooltip />}
      </span>
      <Label>Voted</Label>
      <span className="inline-flex items-center mx-1">{vote}</span>
      <Label>for referendum</Label>
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
