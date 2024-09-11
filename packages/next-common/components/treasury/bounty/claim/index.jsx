import { usePostState } from "next-common/context/post";
import ClaimedInfo from "./ClaimedInfo";
import Claim from "./claim";
import { useOnchainData } from "next-common/context/post";
import { useChainSettings } from "next-common/context/chain";
import useSubStorage from "next-common/hooks/common/useSubStorage";

export default function BountyClaim() {
  const state = usePostState();
  const { hideActionButtons } = useChainSettings();
  const onChain = useOnchainData();

  const { bountyIndex } = onChain;
  const { loading, result: onChainStorage } = useSubStorage("bounties", "bounties", [bountyIndex]);

  if (loading || !onChainStorage?.isSome) {
    return null;
  }

  if (
    !["PendingPayout", "Claimed"].includes(onChain?.state?.state) ||
    hideActionButtons
  ) {
    return null;
  }

  if ("Claimed" === state) {
    return <ClaimedInfo />;
  }

  return <Claim />;
}
