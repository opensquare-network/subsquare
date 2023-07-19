import ChildBountyClaim from "./Action";
import Meta from "./metadata";
import { useOnchainData } from "next-common/context/post";
import { useChainSettings } from "next-common/context/chain";
import { RightBarWrapper } from "next-common/components/layout/sidebar/rightBarWrapper";

export default function Claim() {
  const { hideActionButtons } = useChainSettings();
  const onChain = useOnchainData();
  if (!["PendingPayout", "Claimed"].includes(onChain.state?.state)) {
    return null;
  }

  return (
    <RightBarWrapper>
      <Meta />
      {!hideActionButtons && <ChildBountyClaim />}
    </RightBarWrapper>
  );
}
