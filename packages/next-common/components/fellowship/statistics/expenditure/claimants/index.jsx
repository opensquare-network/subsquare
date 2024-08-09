import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";

function ClaimantsTableHeader() {
  return (
    <div className="flex flex-col gap-[4px]">
      <div className="flex text16Bold text-textPrimary">Claimants</div>
    </div>
  );
}

function StatisticsClaimantsTable() {
  // TODO: loading / display / No Data;
  return <div>Claimants table</div>;
}

export default function StatisticsClaimants() {
  return (
    <SecondaryCard>
      <div className="flex flex-col gap-[16px] h-full">
        <ClaimantsTableHeader />
        <StatisticsClaimantsTable />
      </div>
    </SecondaryCard>
  );
}
