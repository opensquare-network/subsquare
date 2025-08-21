import { isNil } from "lodash-es";
import { AddressUser } from "next-common/components/user";
import { cn } from "next-common/utils";
import Tooltip from "next-common/components/tooltip";
import * as HoverCard from "@radix-ui/react-hover-card";
import LazyLoadableReferendumTitle from "../common/lazyLoadableReferendumTitle";
import Link from "next/link";
import VoteStatus from "../common/voteStatus";
import { VoteDetailCard } from "../common/dvVotesStyled";

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
