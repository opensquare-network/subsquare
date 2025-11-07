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

function WinPercentage({ heatmap }) {
  const totalEligible = heatmap.length;
  const totalWon = useMemo(
    () => heatmap.filter((item) => item?.vote?.isWin).length,
    [heatmap],
  );
  const percentage = totalEligible > 0 ? totalWon / totalEligible : 0;
  return (
    <Tooltip
      content={
        <div>
          <div>Total Referenda(Eligible): {totalEligible}</div>
          <div>Win: {totalWon}</div>
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
        <div className="after:content-['·'] after:mx-2 after:text-textTertiary">
          Participation Rate <AttendancePercentage heatmap={heatmapInRange} />
        </div>
        <div>
          Win Rate <WinPercentage heatmap={heatmapInRange} />
        </div>
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
