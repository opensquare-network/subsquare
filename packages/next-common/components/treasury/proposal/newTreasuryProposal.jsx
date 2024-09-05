import { useRouter } from "next/router";
import NewTreasuryProposalButton from "./newTreasuryProposalButton";
import { getEventData } from "next-common/utils/sendTransaction";
import {
  useProposals,
  useProposalsParams,
} from "next-common/context/treasury/proposals";

export default function NewTreasuryProposal() {
  const router = useRouter();
  const section = useProposals();
  const { urlPrefix } = useProposalsParams();

  return (
    <NewTreasuryProposalButton
      treasuryPallet={section}
      onInBlock={(events) => {
        const eventData = getEventData(events, section, "Proposed");
        if (!eventData) {
          return;
        }
        const [proposalIndex] = eventData;
        router.push(`${urlPrefix}${proposalIndex}`);
      }}
    />
  );
}
