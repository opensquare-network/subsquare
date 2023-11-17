import AccountInfo from "./accountInfo";
import ActiveProposals from "./activeProposals";

export default function Overview() {
  return (
    <div className="space-y-6">
      <AccountInfo />

      <div>
        <ActiveProposals />
        {/* news */}
      </div>
    </div>
  );
}
