import { QuickStart } from "next-common/components/preImages/createPreimagePopup";
import {
  ApproveTreasuryProposal,
  ExternalProposeDefault,
  ExternalProposeMajority,
  RejectTreasuryProposal,
} from "./common";
import { useCollectivePallet } from "next-common/context/collective";
import { useChain } from "next-common/context/chain";
import { isShibuyaChain } from "next-common/utils/chain";
import Chains from "next-common/utils/consts/chains";

export default function CouncilQuickStart({ isMember }) {
  const chain = useChain();
  const collectivePallet = useCollectivePallet();

  const isSupportedChain =
    isShibuyaChain(chain) ||
    [Chains.hydradx, Chains.phala, Chains.khala].includes(chain);

  if (!isSupportedChain || "council" !== collectivePallet) {
    return null;
  }

  return (
    <QuickStart>
      <ApproveTreasuryProposal isMember={isMember} />
      <RejectTreasuryProposal isMember={isMember} />
      <ExternalProposeMajority isMember={isMember} />
      <ExternalProposeDefault isMember={isMember} />
    </QuickStart>
  );
}
