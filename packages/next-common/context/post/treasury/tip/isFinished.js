import { useOnchainData, usePostState } from "../../index";

export default function useTipIsFinished() {
  const onchain = useOnchainData();
  const state = usePostState();
  return onchain.isFinal || "TipClosed" === state;
}
