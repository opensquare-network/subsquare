import { useOnchainData } from "../index";

export function useDecidingSince() {
  const onchain = useOnchainData();
  return onchain.info?.deciding?.since;
}

export function useConfirmingAt() {
  const onchain = useOnchainData();
  return onchain.info?.deciding?.confirming;
}
