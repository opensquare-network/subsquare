import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { CardTitle } from "./styled";
import { useAsync } from "react-use";
import { backendApi } from "next-common/services/nextApi";
import { fellowshipMemberHeatmapApi } from "next-common/services/url";
import { useCallback, useEffect, useMemo, useState } from "react";
import Loading from "next-common/components/loading";
import FellowshipMemberVotes from "./fellowshipMemberVotes";
import { useContextApi } from "next-common/context/api";
import useCall from "next-common/utils/hooks/useCall";
import Heatmap, { LegendBar } from "./heatmap";
import Tooltip from "next-common/components/tooltip";
import { useReferendaFellowshipPallet } from "next-common/context/collectives/collectives";
import { usePageProps } from "next-common/context/page";
import Slider from "next-common/components/slider";

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

function ReferendaSlider({ referendumCount, onSliderChange, defaultRange }) {
  return (
    <div style={{ marginTop: 9, marginBottom: 48 }}>
      <Slider
        min={0}
        max={referendumCount - 1}
        onChange={onSliderChange}
        formatValue={(val) => val}
        defaultValue={defaultRange}
      />
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

  const [rangeFrom, setRangeFrom] = useState(0);
  const [rangeTo, setRangeTo] = useState(-1);

  useEffect(() => {
    setRangeTo(referendumCount);
  }, [referendumCount]);

  const onSliderChange = useCallback(([from, to]) => {
    setRangeFrom(from);
    setRangeTo(to);
  }, []);

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
      <CardTitle>
        Participation Rate <AttendancePercentage heatmap={heatmapInRange} />
      </CardTitle>
      <div className="flex flex-col gap-[16px]">
        <Heatmap
          heatmap={heatmap}
          referendumCount={referendumCount}
          highlightRange={[rangeFrom, rangeTo]}
        />
        <LegendBar />
        <ReferendaSlider
          referendumCount={referendumCount}
          onSliderChange={onSliderChange}
          defaultRange={[rangeFrom, rangeTo]}
        />

        <div>
          <CardTitle>History</CardTitle>
          <FellowshipMemberVotes address={address} />
        </div>
      </div>
    </SecondaryCard>
  );
}
