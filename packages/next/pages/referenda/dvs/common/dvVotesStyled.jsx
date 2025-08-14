import { AddressUser } from "next-common/components/user";
import { cn } from "next-common/utils";
import VoteStatus from "./voteStatus";

export function DvVotesTitle() {
  return <span className="text16Bold mx-6">DV Votes</span>;
}

export function AccountColumn() {
  return (
    <div className="w-[272px] max-sm:w-[200px] flex flex-col">
      <ColumnHeader>Account</ColumnHeader>
      <div
        key="accounts"
        className="flex gap-y-2 flex-col text14Medium text-textPrimary py-4"
      >
        <AddressUser add="" />
        <AddressUser add="" />
        <AddressUser add="" />
        <AddressUser add="" />
      </div>
    </div>
  );
}

export function VoteStatusColumn({ title = "" }) {
  return (
    <div className="w-16">
      <ColumnHeader className="text-center">{title}</ColumnHeader>
      <div className="flex gap-y-2 flex-col items-center justify-center hover:bg-neutral200 py-4">
        <VoteStatus status="Aye" />
        <VoteStatus status="Nay" />
        <VoteStatus status="Abstain" />
        <VoteStatus status="Nil" />
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

export function HeaderDivider() {
  return <div className="h-[1px] bg-neutral300 absolute top-8 left-0 w-full" />;
}

export function VoteIndicator() {
  return (
    <div className="flex gap-x-4 items-center justify-center hover:bg-neutral200 py-4 text-textSecondary text12Medium">
      <div className="flex items-center gap-x-2">
        <VoteStatus status="Aye" /> Aye
      </div>
      <div className="flex items-center gap-x-2">
        <VoteStatus status="Nay" /> Nay
      </div>
      <div className="flex items-center gap-x-2">
        <VoteStatus status="Abstain" /> Abstain
      </div>
      <div className="flex items-center gap-x-2">
        <VoteStatus status="Nil" /> No Vote
      </div>
    </div>
  );
}
