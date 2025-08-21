import { isNil } from "lodash-es";
import { AddressUser } from "next-common/components/user";
import { cn } from "next-common/utils";
import Tooltip from "next-common/components/tooltip";
import * as HoverCard from "@radix-ui/react-hover-card";
import LazyLoadableReferendumTitle from "../common/lazyLoadableReferendumTitle";
import Link from "next/link";
import VoteStatus from "../common/voteStatus";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import { Divider } from "../../trackPanel/lineItem";
import { VOTE_TYPE } from "next-common/utils/dv/voteType";

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
  if (isNil(col) || isNil(col.votesByDelegate)) return null;
  const { votesByDelegate } = col;

  return (
    <div className="w-16">
      <ColumnHeader className="text-center">
        <Tooltip
          content={
            <LazyLoadableReferendumTitle
              referendumIndex={col.referendumIndex}
            />
          }
        >
          <Link
            className="truncate cursor-pointer hover:underline"
            href={`/referenda/${col.referendumIndex}`}
          >
            {title}
          </Link>
        </Tooltip>
      </ColumnHeader>
      <ColumnContent col={col}>
        <div className="flex gap-y-2 flex-col items-center justify-center hover:bg-neutral200 py-4">
          {votesByDelegate.map(([address, voteType]) => (
            <VoteStatus key={address} status={voteType} />
          ))}
        </div>
      </ColumnContent>
    </div>
  );
}

function ColumnContent({ col, children }) {
  return (
    <HoverCard.Root>
      <HoverCard.Trigger>{children}</HoverCard.Trigger>
      <HoverCard.Content side="right">
        <NeutralPanel className="py-3 px-4 gap-y-3 flex flex-col w-[320px]">
          <Link
            className="text16Bold text-textPrimary truncate cursor-pointer hover:underline"
            href={`/referenda/${col.referendumIndex}`}
          >
            <LazyLoadableReferendumTitle
              referendumIndex={col.referendumIndex}
            />
          </Link>
          <Divider />
          <div className="flex flex-col gap-y-2 pt-1">
            {col.votesByDelegate.map(([address, voteType]) => (
              <VoteItem key={address} address={address} voteType={voteType} />
            ))}
          </div>
        </NeutralPanel>
      </HoverCard.Content>
    </HoverCard.Root>
  );
}

function ColumnHeader({ children, className = "" }) {
  return (
    <header className={cn("text14Medium text-textSecondary h-8", className)}>
      <span>{children}</span>
    </header>
  );
}

const voteTypeStyle = {
  [VOTE_TYPE.Aye]: {
    bgClass: "bg-green100 text-green500",
    textClass: "text-green500",
    displayText: "Aye",
  },
  [VOTE_TYPE.Nay]: {
    bgClass: "bg-red100 text-red500",
    textClass: "text-red500",
    displayText: "Nay",
  },
  [VOTE_TYPE.NoVote]: {
    bgClass: "bg-neutral200",
    textClass: "text-textTertiary",
    displayText: "-",
  },
  [VOTE_TYPE.Abstain]: {
    bgClass: "bg-neutral200",
    textClass: "text-textSecondary",
    displayText: "Abstain",
  },
};

function VoteItem({ address, voteType }) {
  const { bgClass, textClass, displayText } = voteTypeStyle[voteType] || {};
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
