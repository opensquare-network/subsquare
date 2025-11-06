import { isNil } from "lodash-es";
import { AddressUser } from "next-common/components/user";
import { cn } from "next-common/utils";
import Tooltip from "next-common/components/tooltip";
import Link from "next/link";
import VoteStatus from "../common/voteStatus";

export function AccountColumn({ delegates }) {
  return (
    <div className="w-[240px] max-sm:w-[200px] flex flex-col">
      <ColumnHeader>Account</ColumnHeader>
      <div
        key="accounts"
        className="flex gap-y-2 flex-col text14Medium text-textPrimary py-4"
      >
        {delegates.map((delegate) => (
          <AddressUser
            add={delegate.address}
            maxWidth={220}
            key={delegate.address}
            username={delegate.name}
          />
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
        <Tooltip content={col.title}>
          <Link
            className="truncate cursor-pointer hover:underline"
            href={`/referenda/${col.referendumIndex}`}
          >
            {title}
          </Link>
        </Tooltip>
      </ColumnHeader>
      <div className="flex gap-y-2 flex-col items-center justify-center py-4">
        {votesByDelegate.map(([address, voteType]) => (
          <VoteStatus key={address} status={voteType} />
        ))}
      </div>
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
