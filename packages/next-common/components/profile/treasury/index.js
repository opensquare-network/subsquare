import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import ProfileTreasurySummary from "./summary";
import ProfileTreasuryTabs from "./tabs";
import { usePageProps } from "next-common/context/page";

export default function ProfileTreasury() {
  const { beneficiariesSummary } = usePageProps();

  if (!beneficiariesSummary) {
    return null;
  }

  return (
    <div className="flex flex-col gap-y-4">
      <ProfileTreasurySummary />
      <SecondaryCard>
        <ProfileTreasuryTabs />
      </SecondaryCard>
    </div>
  );
}
