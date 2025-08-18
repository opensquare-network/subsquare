import { AddressUser } from "next-common/components/user";
import { cn } from "next-common/utils";
import * as HoverCard from "@radix-ui/react-hover-card";
import VoteStatus from "./voteStatus";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import Divider from "next-common/components/styled/layout/divider";
import { isNil } from "lodash-es";
import { VOTE_TYPE } from "next-common/utils/dv/voteType";

export function DvVotesTitle() {
  return <span className="text16Bold mx-6 text-textPrimary">DV Votes</span>;
}

export function AccountColumn({ accounts }) {
  return (
    <div className="w-[272px] max-sm:w-[200px] flex flex-col">
      <ColumnHeader>Account</ColumnHeader>
      <div
        key="accounts"
        className="flex gap-y-2 flex-col text14Medium text-textPrimary py-4"
      >
        {accounts.map((address) => (
          <AddressUser add={address} maxWidth={240} key={address} />
        ))}
      </div>
    </div>
  );
}

export function VoteStatusColumn({ title = "", col }) {
  if (isNil(col)) return null;

  const { votesByDelegate } = col;

  return (
    <div className="w-16">
      <ColumnHeader className="text-center">{title}</ColumnHeader>
      <HoverCard.Root>
        <HoverCard.Trigger>
          <div className="flex gap-y-2 flex-col items-center justify-center hover:bg-neutral200 py-4">
            {votesByDelegate.map(([address, voteType]) => (
              <VoteStatus key={address} status={voteType} />
            ))}
          </div>
        </HoverCard.Trigger>
        <HoverCard.Content side="right">
          <VoteDetailCard col={col} />
        </HoverCard.Content>
      </HoverCard.Root>
    </div>
  );
}

function ColumnHeader({ children, className = "" }) {
  return (
    <header className={cn("text14Medium text-textSecondary h-8", className)}>
      <span>{children}</span>
    </header>
  );
}

export function HeaderDivider() {
  return <div className="h-[1px] bg-neutral300 absolute top-8 left-0 w-full" />;
}

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
      <div className="text16Bold text-textPrimary">Referendum: Title</div>
      <Divider />
      <div className="flex flex-col gap-y-2 pt-1">
        {col.votesByDelegate.map(([address, voteType]) => (
          <VoteItem key={address} address={address} voteType={voteType} />
        ))}
      </div>
    </NeutralPanel>
  );
}
