import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { CardTitle } from "./styled";
import { useAsync } from "react-use";
import nextApi from "next-common/services/nextApi";
import { fellowshipMemberHeatmapApi } from "next-common/services/url";
import { useMemo } from "react";
import Loading from "next-common/components/loading";
import FellowshipMemberVotes from "./fellowshipMemberVotes";
import { useContextApi } from "next-common/context/api";
import useCall from "next-common/utils/hooks/useCall";
import Heatmap, { LegendBar } from "./heatmap";
import Tooltip from "next-common/components/tooltip";
import { useReferendaFellowshipPallet } from "next-common/context/collectives/collectives";
import { usePageProps } from "next-common/context/page";

function LoadingCard() {
  return (
    <SecondaryCard>
      <div className="flex justify-center p-[16px]">
        <Loading size={20} />
      </div>
    </SecondaryCard>
  );
}

function NoReferenda() {
  return (
    <SecondaryCard>
      <div className="py-[16px] text-center">
        <span className="text14Medium text-textTertiary">No referenda yet</span>
      </div>
    </SecondaryCard>
  );
}

function AttendancePercentage({ heatmap }) {
  const totalEligible = heatmap.length;
  const totalVoted = useMemo(
    () => heatmap.filter((item) => item.isVoted).length,
    [heatmap],
  );
  const percentage = totalEligible > 0 ? totalVoted / totalEligible : 0;
  return (
    <Tooltip
      content={
        <div>
          <div>Total Referenda(Eligible): {totalEligible}</div>
          <div>Voted: {totalVoted}</div>
        </div>
      }
    >
      <span className="text14Medium text-textTertiary">{`${(
        percentage * 100
      ).toFixed(2)}%`}</span>
    </Tooltip>
  );
}

export default function VoteActivities() {
  const { id: address } = usePageProps();
  const api = useContextApi();
  const referendaPallet = useReferendaFellowshipPallet();
  const { value: referendumCount, loaded: isReferendumCountLoaded } = useCall(
    api?.query?.[referendaPallet]?.referendumCount,
    [],
  );
  const { value: { result: heatmap } = {}, loading: isHeatmapLoading } =
    useAsync(async () => {
      return await nextApi.fetch(fellowshipMemberHeatmapApi(address));
    }, [address]);

  if (!isReferendumCountLoaded || isHeatmapLoading) {
    return <LoadingCard />;
  }

  if (!referendumCount) {
    return <NoReferenda />;
  }

  return (
    <SecondaryCard>
      <CardTitle>
        Participation Rate <AttendancePercentage heatmap={heatmap} />
      </CardTitle>
      <div className="flex flex-col gap-[16px]">
        <Heatmap heatmap={heatmap} referendumCount={referendumCount} />
        <LegendBar />
        <div>
          <CardTitle>History</CardTitle>
          <FellowshipMemberVotes address={address} />
        </div>
      </div>
    </SecondaryCard>
  );
}
