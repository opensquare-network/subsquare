import { isNil } from "lodash-es";
import { useChain } from "next-common/context/chain";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import Chains from "next-common/utils/consts/chains";
import getChainSettings from "next-common/utils/consts/settings";
import { useSelector } from "react-redux";

export default function useBlockTime() {
  const chain = useChain();
  let blockTime;
  const storeBlockTime = useSelector(blockTimeSelector);

  if (Chains.polkadotCoretime === chain) {
    blockTime = getChainSettings(Chains.polkadot)?.blockTime;
  } else if (Chains.kusamaCoretime === chain) {
    blockTime = getChainSettings(Chains.kusama)?.blockTime;
  }

  if (isNil(blockTime)) {
    blockTime = storeBlockTime;
  }

  return blockTime;
}
