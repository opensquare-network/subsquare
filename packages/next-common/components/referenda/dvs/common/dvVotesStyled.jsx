import { AddressUser } from "next-common/components/user";
import { cn } from "next-common/utils";
import VoteStatus from "./voteStatus";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import Divider from "next-common/components/styled/layout/divider";
import { VOTE_TYPE } from "next-common/utils/dv/voteType";
import LazyLoadableReferendumTitle from "./lazyLoadableReferendumTitle";
import Link from "next/link";
import tw from "tailwind-styled-components";

export const TabsTitle = tw.span`text16Bold mx-6 text-textPrimary`;

export const HeaderDivider = tw.div`h-[1px] bg-neutral300 absolute top-8 left-0 w-full`;

export function VoteIndicator() {
  return (
    <div className="flex gap-x-4 items-center justify-center py-4 text-textSecondary text12Medium">
      <div className="flex items-center gap-x-2">
        <VoteStatus status={VOTE_TYPE.Aye} /> Aye
      </div>
      <div className="flex items-center gap-x-2">
        <VoteStatus status={VOTE_TYPE.Nay} /> Nay
      </div>
      <div className="flex items-center gap-x-2">
        <VoteStatus status={VOTE_TYPE.Abstain} /> Abstain
      </div>
      <div className="flex items-center gap-x-2">
        <VoteStatus status={VOTE_TYPE.NoVote} /> No Vote
      </div>
    </div>
  );
}

function VoteItem({ address, voteType }) {
  let bgClass = "bg-neutral200";
  let textClass = "text-textSecondary";
  let displayText = voteType;
  if (voteType === VOTE_TYPE.Aye) {
    bgClass = "bg-green100 text-green500";
    textClass = "text-green500";
  } else if (voteType === VOTE_TYPE.Nay) {
    bgClass = "bg-red100 text-red500";
    textClass = "text-red500";
  } else if (voteType === VOTE_TYPE.NoVote) {
    displayText = "-";
    textClass = "text-textTertiary";
  }

  return (
    <div
      className={cn(
        "flex gap-x-4 items-center justify-between px-4 py-[10px] text-textSecondary text12Medium h-10 rounded-lg",
        bgClass,
      )}
    >
      <AddressUser add={address} maxWidth={128} />
      <span className={cn("text14Medium", textClass)}>{displayText}</span>
    </div>
  );
}

export function VoteDetailCard({ col }) {
  return (
    <NeutralPanel className="py-3 px-4 gap-y-3 flex flex-col w-[320px]">
      <Link
        className="text16Bold text-textPrimary truncate cursor-pointer hover:underline"
        href={`/referenda/${col.referendumIndex}`}
      >
        <LazyLoadableReferendumTitle referendumIndex={col.referendumIndex} />
      </Link>
      <Divider />
      <div className="flex flex-col gap-y-2 pt-1">
        {col.votesByDelegate.map(([address, voteType]) => (
          <VoteItem key={address} address={address} voteType={voteType} />
        ))}
      </div>
    </NeutralPanel>
  );
}
