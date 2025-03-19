import { cn } from "next-common/utils";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { CardTitle } from "./styled";
import { useAsync } from "react-use";
import nextApi from "next-common/services/nextApi";
import { fellowshipMemberHeatmapApi } from "next-common/services/url";
import { useMemo } from "react";
import Loading from "next-common/components/loading";
import Tooltip from "next-common/components/tooltip";
import FellowshipMemberVotes from "./fellowshipMemberVotes";
import { DropdownFilterProvider } from "next-common/components/dropdownFilter/context";
import { defaultFilterValues } from "next-common/components/profile/votingHistory/voteFilter";
import { useContextApi } from "next-common/context/api";
import useCall from "next-common/utils/hooks/useCall";

function Square({ className, children }) {
  return (
    <div className="p-[1px]">
      <div className={cn("w-[10px] h-[10px] rounded-[2px]", className)}>
        {children}
      </div>
    </div>
  );
}

function AyeSquare() {
  return <Square className="bg-green300" />;
}

function NaySquare() {
  return <Square className="bg-red300" />;
}

function NoVoteSquare() {
  return <Square className="bg-neutral300" />;
}

function NotEligibleSquare() {
  return (
    <Square className="bg-neutral300 p-[2px]">
      <div className="w-full h-full bg-neutral100"></div>
    </Square>
  );
}

function LegendItem({ children, text }) {
  return (
    <div className="flex gap-[8px] text12Medium items-center">
      {children}
      <span className="text-textSecondary">{text}</span>
    </div>
  );
}

function LegendBar() {
  return (
    <div className="flex justify-center">
      <div className="flex gap-[16px]">
        <LegendItem text="Aye">
          <AyeSquare />
        </LegendItem>
        <LegendItem text="Nay">
          <NaySquare />
        </LegendItem>
        <LegendItem text="No Vote">
          <NoVoteSquare />
        </LegendItem>
        <LegendItem text="Not Eligible">
          <NotEligibleSquare />
        </LegendItem>
      </div>
    </div>
  );
}

function Heatmap({ heatmap, referendumCount }) {
  const heatmapData = useMemo(() => {
    const data = {};
    heatmap?.forEach((item) => {
      data[item.referendumIndex] = item;
    });
    return data;
  }, [heatmap]);

  return (
    <div className="flex justify-center">
      <div className="flex gap-[6px] flex-wrap">
        {Array.from({ length: referendumCount }).map((_, index) => {
          const item = heatmapData[index];
          return (
            <Tooltip content={`Referendum #${index}`} key={index}>
              {!item ? (
                <NotEligibleSquare key={index} />
              ) : !item.isVoted ? (
                <NoVoteSquare key={index} />
              ) : item.vote.isAye ? (
                <AyeSquare key={index} />
              ) : (
                <NaySquare key={index} />
              )}
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}

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
