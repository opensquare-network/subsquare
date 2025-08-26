import { AddressUser } from "next-common/components/user";
import {
  useDvReferendaCount,
  useFilteredDvReferenda,
  useFilteredDvVotes,
} from "next-common/context/referenda/dv";
import isWin from "next-common/utils/dv/isWin";
import DataList from "next-common/components/dataList";
import VoteByDelegate from "../voteByDelegate";
import { ParticipationValue } from "../common/cohortValueStyled";
import WinRate from "../common/winRate";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import Tooltip from "next-common/components/tooltip";

const columns = [
  {
    name: "Account",
    style: { width: 240, textAlign: "left" },
  },
  {
    name: "Vote Counts",
    style: { textAlign: "left" },
  },
  {
    name: "Participation",
    style: { width: 120, textAlign: "right" },
  },
  {
    name: (
      <span className="flex justify-end items-center gap-1">
        Win Rate
        <WinRateTooltip />
      </span>
    ),
    style: { width: 120, textAlign: "right" },
  },
];

export default function DelegatesDesktopList({ delegates }) {
  const count = useDvReferendaCount();
  const filteredReferenda = useFilteredDvReferenda();
  const votes = useFilteredDvVotes();

  const rows = delegates.map((delegate) => {
    const userVotes = votes.filter((vote) => vote.account === delegate);
    const voteCount = userVotes.length;
    const winCount = userVotes.filter((vote) =>
      isWin(vote, filteredReferenda),
    ).length;

    return [
      <AddressUser key="account" add={delegate} maxWidth={220} />,
      <VoteByDelegate
        key="voteCounts"
        height={4}
        delegate={delegate}
        userVotes={userVotes}
      />,
      <ParticipationValue
        key="participation"
        voteCount={voteCount}
        totalCount={count}
      />,
      <WinRate key="winRate" winCount={winCount} voteCount={voteCount} />,
    ];
  });

  return (
    <NeutralPanel className="p-6">
      <DataList
        columns={columns}
        rows={rows}
        loading={false}
        noDataText="No delegates"
        bordered={false}
      />
    </NeutralPanel>
  );
}

function WinRateTooltip() {
  return (
    <Tooltip content="Probability that DV's votes align with the outcomes of referenda" />
  );
}
