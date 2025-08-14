import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import { AddressUser } from "next-common/components/user";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import VoteStatus from "./common/voteStatus";
import WindowSizeProvider from "next-common/context/windowSize";
import { useIsMobile } from "next-common/components/overview/accountInfo/components/accountBalances";

const referenda = [...Array(20)];

export default function ReferendaDVsVotes() {
  return (
    <div className="flex flex-col gap-y-4">
      <DvVotesTitle />
      <NeutralPanel className="p-6">
        <WindowSizeProvider>
          <ReferendaDVsVotesImpl />
        </WindowSizeProvider>
      </NeutralPanel>
    </div>
  );
}

export function ReferendaDVsVotesImpl() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <ScrollerX>
        <div className="flex-1 flex">
          <AccountColumn />
          {referenda.map((_, idx) => (
            <VoteStatusColumn key={idx} title={`#${idx + 1}`} />
          ))}
        </div>
      </ScrollerX>
    );
  }

  return (
    <div className="flex">
      <AccountColumn />
      <ScrollerX className="flex-1">
        <div className="flex-1 flex">
          {referenda.map((_, idx) => (
            <VoteStatusColumn key={idx} title={`#${idx + 1}`} />
          ))}
        </div>
      </ScrollerX>
    </div>
  );
}

function DvVotesTitle() {
  return <span className="text16Bold mx-6">DV Votes</span>;
}

function AccountColumn() {
  return (
    <div className="w-[272px] max-w-[200px] flex flex-col">
      <header className="text14Medium text-textTertiary h-8 border-b border-neutral300">
        <span>Account</span>
      </header>
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

function VoteStatusColumn({ title = "" }) {
  return (
    <div className="w-16">
      <header className="text14Medium text-textSecondary text-center h-8 border-b border-neutral300">
        <span>{title}</span>
      </header>
      <div className="flex gap-y-2 flex-col items-center justify-center hover:bg-neutral200 py-4">
        <VoteStatus status="Aye" />
        <VoteStatus status="Nay" />
        <VoteStatus status="Abstain" />
        <VoteStatus status="Nil" />
      </div>
    </div>
  );
}
