import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { CardTitle } from "./styled";

function NoEvidence() {
  return (
    <div className="py-[16px] text-center">
      <span className="text14Medium text-textTertiary">No evidence yet</span>
    </div>
  );
}

export default function OnchainEvidence() {
  return (
    <SecondaryCard>
      <CardTitle>On-chain Evidence</CardTitle>
      <NoEvidence />
    </SecondaryCard>
  );
}
