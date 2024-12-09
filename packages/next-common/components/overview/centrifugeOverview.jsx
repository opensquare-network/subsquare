import AccountInfo from "./accountInfo";
import RecentProposals from "./recentProposals";
import CentrifugeStats from "./centrifugeStats";

export default function CentrifugeOverview() {
  return (
    <div className="space-y-6">
      <AccountInfo />

      <CentrifugeStats />

      <RecentProposals />
    </div>
  );
}
