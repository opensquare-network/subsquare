import { useMemo } from "react";
import { useAsync } from "react-use";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { CardTitle } from "./styled";
import { backendApi } from "next-common/services/nextApi";
import { fellowshipMemberHeatmapApi } from "next-common/services/url";
import Loading from "next-common/components/loading";
import FellowshipMemberVotes from "./fellowshipMemberVotes";
import { useContextApi } from "next-common/context/api";
import useCall from "next-common/utils/hooks/useCall";
import Heatmap, { LegendBar } from "./heatmap";
import Tooltip from "next-common/components/tooltip";
import { useReferendaFellowshipPallet } from "next-common/context/collectives/collectives";
import { usePageProps } from "next-common/context/page";
import useReferendaSlider from "./referendaSlider";
import { WinRateTooltip } from "next-common/components/referenda/dv/delegates/desktopList";

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
    <div className="flex items-center gap-1">
      Participation Rate
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
    </div>
  );
}

function WinPercentage({ heatmap }) {
  const votedTotal = useMemo(
    () => heatmap.filter((item) => item.isVoted && item.isFinal).length,
    [heatmap],
  );
  const winTotal = useMemo(
    () => heatmap.filter((item) => item?.vote?.isWin && item.isFinal).length,
    [heatmap],
  );
  const percentage = votedTotal > 0 ? winTotal / votedTotal : 0;

  if (!winTotal) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 before:content-['·'] before:mx-2 before:text-textTertiary">
      Win Rate <WinRateTooltip />
      <Tooltip
        content={
          <div>
            <div>Total Referenda(Voted & Finalized): {votedTotal}</div>
            <div>Win: {winTotal}</div>
          </div>
        }
      >
        <span className="text14Medium text-textTertiary">{`${(
          percentage * 100
        ).toFixed(2)}%`}</span>
      </Tooltip>
    </div>
  );
}

export default function VoteActivities() {
  const { id: address } = usePageProps();
  const api = useContextApi();
  const referendaPallet = useReferendaFellowshipPallet();
  const { value: referendumCountValue, loaded: isReferendumCountLoaded } =
    useCall(api?.query?.[referendaPallet]?.referendumCount, []);
  const referendumCount = referendumCountValue?.toNumber();

  const { value: { result: heatmap = [] } = {}, loading: isHeatmapLoading } =
    useAsync(async () => {
      return await backendApi.fetch(fellowshipMemberHeatmapApi(address));
    }, [address]);

  const {
    component: slider,
    rangeFrom,
    rangeTo,
  } = useReferendaSlider(referendumCount);

  const heatmapInRange = useMemo(() => {
    if (isNaN(rangeTo) || isNaN(rangeFrom) || rangeFrom > rangeTo) {
      return heatmap;
    }
    return heatmap.filter(
      ({ referendumIndex }) =>
        referendumIndex >= rangeFrom && referendumIndex <= rangeTo,
    );
  }, [heatmap, rangeFrom, rangeTo]);

  if (!isReferendumCountLoaded || isHeatmapLoading) {
    return <LoadingCard />;
  }

  if (!referendumCount) {
    return <NoReferenda />;
  }

  return (
    <SecondaryCard>
      <CardTitle className="flex flex-wrap">
        <AttendancePercentage heatmap={heatmapInRange} />
        <WinPercentage heatmap={heatmapInRange} />
      </CardTitle>
      <div className="flex flex-col gap-[16px]">
        <Heatmap
          heatmap={heatmap}
          referendumCount={referendumCount}
          highlightRange={[rangeFrom, rangeTo]}
        />
        {slider}
        <LegendBar />
        <div>
          <CardTitle>History</CardTitle>
          <FellowshipMemberVotes address={address} />
        </div>
      </div>
    </SecondaryCard>
  );
}
