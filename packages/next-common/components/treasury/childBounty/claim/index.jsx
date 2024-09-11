import { usePostState } from "next-common/context/post";
import ClaimedInfo from "./ClaimedInfo";
import Claim from "./claim";
import { useChainSettings } from "next-common/context/chain";

export default function ChildBountyClaim() {
  const state = usePostState();

  const { hideActionButtons } = useChainSettings();
  if (hideActionButtons) {
    return null;
  }

  if ("Claimed" === state) {
    return <ClaimedInfo />;
  }

  return <Claim />;
}
