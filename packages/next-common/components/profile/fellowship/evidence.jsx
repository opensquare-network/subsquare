import OnchainEvidence from "next-common/components/pages/fellowship/member/fellowshipMember/onchainEvidence";
import useProfileAddress from "../useProfileAddress";
import { FellowshipEvidenceProvider } from "next-common/context/fellowship/evidence";

export default function ProfileFellowshipEvidence({ section }) {
  const who = useProfileAddress();
  if (section === "fellowship") {
    return (
      <FellowshipEvidenceProvider who={who}>
        <OnchainEvidence />
      </FellowshipEvidenceProvider>
    );
  }
  return null;
}
