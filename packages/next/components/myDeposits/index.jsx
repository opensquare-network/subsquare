import { AccountSubTabs } from "components/overview/account/subTabs";
import MyDemocracyDeposits from "./democracy";

export default function MyDeposits() {
  return (
    <div className="space-y-6">
      <AccountSubTabs />

      <div>
        <MyDemocracyDeposits />
      </div>
    </div>
  );
}
