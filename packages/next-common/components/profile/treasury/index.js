import ProfileTreasurySummary from "./summary";
import ProfileTreasuryProposals from "./proposals";

export default function ProfileTreasury() {
  return (
    <div className="flex flex-col gap-y-4">
      <ProfileTreasurySummary />
      <ProfileTreasuryProposals />
    </div>
  );
}
