import BeenDelegated from "next-common/components/delegation/my-delegation/beenDelegated";
import MyDelegationLayout from "./layout";

export default function MyReceivedDelegations() {
  return (
    <MyDelegationLayout>
      <div className="ml-[24px]">
        <BeenDelegated />
      </div>
    </MyDelegationLayout>
  );
}
