import { useMemo } from "react";
import { CardTitle } from "./styled";
import Heatmap, { LegendBar } from "./heatmap";
import Tooltip from "next-common/components/tooltip";
import { usePageProps } from "next-common/context/page";
import useReferendaSlider from "./referendaSlider";
import { WinRateTooltip } from "next-common/components/referenda/dv/delegates/desktopList";

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

export default function VoteActivitySummary() {
  const { fellowshipReferendaMaxIndex, fellowshipMemberHeatmap } =
    usePageProps();
  // Referendum indexes are 0-based contiguous on chain, so count = maxIndex + 1
  const referendumCount =
    fellowshipReferendaMaxIndex === null ? 0 : fellowshipReferendaMaxIndex + 1;
  const heatmap = useMemo(
    () => fellowshipMemberHeatmap || [],
    [fellowshipMemberHeatmap],
  );

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

  if (!referendumCount) {
    return (
      <div className="py-[16px] text-center">
        <span className="text14Medium text-textTertiary">No referenda yet</span>
      </div>
    );
  }

  return (
    <>
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
      </div>
    </>
  );
}
