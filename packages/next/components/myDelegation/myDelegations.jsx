import DelegatedVotes from "next-common/components/delegation/my-delegation/delegatedVotes";
import MyDelegationLayout from "./layout";

export default function MyDelegations() {
  return (
    <MyDelegationLayout>
      <div className="ml-[24px]">
        <DelegatedVotes />
      </div>
    </MyDelegationLayout>
  );
}
