import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { CardTitle } from "./styled";
import { useAsync } from "react-use";
import nextApi from "next-common/services/nextApi";
import { fellowshipMemberHeatmapApi } from "next-common/services/url";
import { useMemo } from "react";
import Loading from "next-common/components/loading";
import FellowshipMemberVotes from "./fellowshipMemberVotes";
import { DropdownFilterProvider } from "next-common/components/dropdownFilter/context";
import { defaultFilterValues } from "next-common/components/profile/votingHistory/voteFilter";
import { useContextApi } from "next-common/context/api";
import useCall from "next-common/utils/hooks/useCall";
import Heatmap, { LegendBar } from "./heatmap";
import Tooltip from "next-common/components/tooltip";

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
      <span className="text-textTertiary">{`${(percentage * 100).toFixed(
        2,
      )}%`}</span>
    </Tooltip>
  );
}

export default function ReferendaActivities({ address }) {
  const api = useContextApi();
  const { value: referendumCount, loaded: isReferendumCountLoaded } = useCall(
    api?.query?.fellowshipReferenda?.referendumCount,
    [],
  );
  const { value: { result: heatmap } = {}, loading: isHeatmapLoading } =
    useAsync(async () => {
      return await nextApi.fetch(fellowshipMemberHeatmapApi(address));
    }, [address]);

  if (!isReferendumCountLoaded || isHeatmapLoading) {
    return <LoadingCard />;
  }

  if (referendumCount === 0) {
    return <NoReferenda />;
  }

  return (
    <SecondaryCard>
      <div className="flex flex-col gap-[16px]">
        <CardTitle>
          Attendance <AttendancePercentage heatmap={heatmap} />
        </CardTitle>
        <Heatmap heatmap={heatmap} referendumCount={referendumCount} />
        <LegendBar />
        <CardTitle>History</CardTitle>
        <DropdownFilterProvider defaultFilterValues={defaultFilterValues}>
          <FellowshipMemberVotes address={address} />
        </DropdownFilterProvider>
      </div>
    </SecondaryCard>
  );
}
