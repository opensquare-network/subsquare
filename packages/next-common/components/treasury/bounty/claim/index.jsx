import { usePostState } from "next-common/context/post";
import ClaimedInfo from "./ClaimedInfo";
import Claim from "./claim";
import { useOnchainData } from "next-common/context/post";
import { useChainSettings } from "next-common/context/chain";

export default function BountyClaim() {
  const state = usePostState();
  const { hideActionButtons } = useChainSettings();
  const onChain = useOnchainData();
  if (
    !["PendingPayout", "Claimed"].includes(onChain.state?.state) ||
    hideActionButtons
  ) {
    return null;
  }

  if ("Claimed" === state) {
    return <ClaimedInfo />;
  }

  return <Claim />;
}
