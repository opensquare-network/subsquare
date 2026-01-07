import SchedulesTable from "next-common/components/data/vesting/popup/schedulesTable";
import { useProfileVestingContext } from "./context";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";

export default function ProfileVestingShchedules() {
  const { data, isLoading } = useProfileVestingContext();

  return (
    <div className="flex flex-col gap-4">
      <TitleContainer className="inline-flex justify-start">
        Schedules
        <span className="text14Medium text-textTertiary ml-2">
          {data?.schedules?.length ?? null}
        </span>
      </TitleContainer>
      <SecondaryCard>
        <SchedulesTable
          schedules={data?.schedules ?? null}
          loading={isLoading}
        />
      </SecondaryCard>
    </div>
  );
}
