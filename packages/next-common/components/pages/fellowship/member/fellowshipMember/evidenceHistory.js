import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import ProfileFellowshipCoreEvidence from "next-common/components/profile/fellowship/core/evidence";
import { noop } from "lodash-es";

export default function EvidenceHistory() {
  return (
    <SecondaryCard>
      <ProfileFellowshipCoreEvidence
        setEvidenceCount={noop}
        className="grid-cols-2"
        noDateText="No evidences"
      />
    </SecondaryCard>
  );
}
