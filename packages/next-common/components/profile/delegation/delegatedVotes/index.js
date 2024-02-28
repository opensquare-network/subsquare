import TracksSummary from "../common/tracksSummary";
import MyDelegation from "./myDelegation";

export default function DelegatedVotes() {
  return (
    <div className="flex flex-col">
      <TracksSummary />
      <MyDelegation />
    </div>
  );
}
