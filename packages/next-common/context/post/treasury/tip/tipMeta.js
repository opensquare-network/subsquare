import { useOnchainData } from "../../index";

export default function usePostTipMeta() {
  const onchain = useOnchainData();
  return onchain.meta;
}
