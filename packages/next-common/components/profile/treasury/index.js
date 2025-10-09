import ProfileTreasurySummary from "./summary";
import ProfileTreasuryProposals from "./proposals";
import { usePageProps } from "next-common/context/page";

export default function ProfileTreasury() {
  const { beneficiariesSummary } = usePageProps();

  if (!beneficiariesSummary) {
    return null;
  }

  return (
    <div className="flex flex-col gap-y-4">
      <ProfileTreasurySummary />
      <ProfileTreasuryProposals />
    </div>
  );
}
