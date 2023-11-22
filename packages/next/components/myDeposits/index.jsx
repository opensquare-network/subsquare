import { AccountSubTabs } from "components/overview/account/subTabs";
import MyDemocracyDeposits from "./democracy";
import MyReferendaDeposits from "./referenda";

export default function MyDeposits() {
  return (
    <div className="space-y-6">
      <AccountSubTabs />

      <div className="space-y-6">
        <MyReferendaDeposits />
        <MyDemocracyDeposits />
      </div>
    </div>
  );
}
