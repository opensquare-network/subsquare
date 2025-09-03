import { AddressUser } from "next-common/components/user";
import {
  useDvReferendaCount,
  useFilteredDvReferenda,
} from "next-common/context/referenda/dv";
import isWin from "next-common/utils/dv/isWin";
import DataList from "next-common/components/dataList";
import VoteByDelegate from "../voteByDelegate";
import { ParticipationValue } from "../common/cohortValueStyled";
import WinRate from "../common/winRate";
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

  const rows = delegates.map((delegate) => {
    const winCount = delegate.userVotes.filter((vote) =>
      isWin(vote, filteredReferenda),
    ).length;

    return [
      <AddressUser key="account" add={delegate.address} maxWidth={220} />,
      <VoteByDelegate
        key="voteCounts"
        height={4}
        delegate={delegate.address}
        userVotes={delegate.userVotes}
      />,
      <ParticipationValue
        key="participation"
        voteCount={delegate.voteCount}
        totalCount={count}
      />,
      <WinRate
        key="winRate"
        winCount={winCount}
        voteCount={delegate.voteCount}
      />,
    ];
  });

  return (
    <DataList
      columns={columns}
      rows={rows}
      loading={false}
      noDataText="No delegates"
      bordered={false}
    />
  );
}

function WinRateTooltip() {
  return (
    <Tooltip content="Probability that DV's votes align with the outcomes of referenda" />
  );
}
