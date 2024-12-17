import { QuickStart } from "next-common/components/preImages/createPreimagePopup";
import { useChain } from "next-common/context/chain";
import { useCollectivePallet } from "next-common/context/collective";
import {
  ApproveTreasuryProposal,
  CollectiveProxyCall,
  DappStakingRegister,
  DappStakingUnRegister,
  RejectTreasuryProposal,
} from "./common";
import { isShibuyaChain } from "next-common/utils/chain";

export default function CommunityCouncilQuickStart({ isMember }) {
  const chain = useChain();
  const collectivePallet = useCollectivePallet();

  const isSupportedChain = isShibuyaChain(chain);

  if (!isSupportedChain || "communityCouncil" !== collectivePallet) {
    return null;
  }

  return (
    <QuickStart>
      <ApproveTreasuryProposal isMember={isMember} />
      <RejectTreasuryProposal isMember={isMember} />
      <DappStakingRegister isMember={isMember} />
      <DappStakingUnRegister isMember={isMember} />
      <CollectiveProxyCall isMember={isMember} />
    </QuickStart>
  );
}
