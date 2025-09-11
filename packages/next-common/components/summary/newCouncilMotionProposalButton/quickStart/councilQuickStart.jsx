import { QuickStart } from "next-common/components/preImages/createPreimagePopup";
import {
  ApproveTreasuryProposal,
  ExternalProposeDefault,
  ExternalProposeMajority,
  RejectTreasuryProposal,
} from "./common";
import { useCollectivePallet } from "next-common/context/collective";
import { useChain } from "next-common/context/chain";
import { isShibuyaChain, isLaosChain } from "next-common/utils/chain";
import Chains from "next-common/utils/consts/chains";

function LaosNetworkCouncilQuickStart({ isMember }) {
  return (
    <QuickStart>
      <ExternalProposeMajority isMember={isMember} />
      <ExternalProposeDefault isMember={isMember} />
    </QuickStart>
  );
}

export default function CouncilQuickStart({ isMember }) {
  const chain = useChain();
  const collectivePallet = useCollectivePallet();

  const isSupportedChain =
    isShibuyaChain(chain) ||
    isLaosChain(chain) ||
    [Chains.hydradx, Chains.phala, Chains.khala].includes(chain);

  if (!isSupportedChain || "council" !== collectivePallet) {
    return null;
  }

  if (isLaosChain(chain)) {
    return <LaosNetworkCouncilQuickStart isMember={isMember} />;
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
