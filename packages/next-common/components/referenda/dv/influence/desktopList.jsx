import DataList from "next-common/components/dataList";
import { useMemo } from "react";
import Track from "../../track/trackTag";
import { getGov2ReferendumTitle } from "next-common/utils/gov2/title";
import PostVotesSummary from "next-common/components/postList/common/votesSummary";
import { useChainSettings } from "next-common/context/chain";
import ActionButton from "./actionButton";
import StateTag from "./stateTag";
import InfluenceValue from "./influenceValue";
import { InfluenceLabel } from "./styled";
import { PostTitleImpl } from "next-common/components/profile/votingHistory/common";

const columns = [
  {
    name: "Referendum",
    style: { textAlign: "left" },
    className: "flex-1 whitespace-nowrap overflow-hidden text-ellipsis pr-1",
  },
  {
    name: "Track",
    style: { width: 160, extAlign: "left" },
  },
  {
    name: "",
    style: { width: 24 },
  },
  {
    name: "Status",
    style: { width: 120, textAlign: "right" },
  },
  {
    name: <InfluenceLabel className="justify-end" />,
    style: { width: 120, textAlign: "right" },
  },
  {
    name: "",
    style: { width: 80, textAlign: "right" },
  },
];

export default function InfluenceDesktopList({
  referendumData,
  delegateReferendumVotesMap,
  loading = false,
}) {
  const { symbol, decimals } = useChainSettings();
  const rows = useMemo(() => {
    if (!referendumData) {
      return [];
    }

    return referendumData.map((referendum) => [
      <PostTitleImpl
        key="title"
        referendumIndex={referendum.referendumIndex}
        title={getGov2ReferendumTitle(referendum)}
        url={`/referenda/${referendum.referendumIndex}`}
      />,
      <Track key="track" id={referendum.track} />,
      <PostVotesSummary
        tally={referendum.onchainData?.tally}
        decimals={decimals}
        symbol={symbol}
        key="votesSummary"
      />,
      <StateTag key="state" referendum={referendum} />,
      <InfluenceValue
        referendum={referendum}
        referendumVotes={
          delegateReferendumVotesMap[referendum.referendumIndex] || []
        }
        key="influence"
      />,
      <ActionButton
        referendum={referendum}
        referendumVotes={
          delegateReferendumVotesMap[referendum.referendumIndex] || []
        }
        key="action"
      />,
    ]);
  }, [referendumData, delegateReferendumVotesMap, decimals, symbol]);

  return (
    <DataList
      title="Influence"
      noDataText="No influence"
      columns={columns}
      rows={rows}
      loading={loading}
    />
  );
}
