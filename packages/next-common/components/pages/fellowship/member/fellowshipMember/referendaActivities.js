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

  const attendancePercentage = useMemo(() => {
    if (isHeatmapLoading || !isReferendumCountLoaded) {
      return 0;
    }
    if (referendumCount === 0 || !heatmap || heatmap.length === 0) {
      return 0;
    }
    const totalVoted = heatmap.filter((item) => item.isVoted).length;
    return (totalVoted / referendumCount) * 100;
  }, [heatmap, referendumCount, isReferendumCountLoaded, isHeatmapLoading]);

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
          Attendance{" "}
          <span className="text-textTertiary">
            {attendancePercentage.toFixed(2)}%
          </span>
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
