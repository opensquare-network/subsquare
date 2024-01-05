import { useChain } from "next-common/context/chain";
import { useUser } from "next-common/context/user";
import Chains from "../consts/chains";
import { isEthereumAddress } from "@polkadot/util-crypto";
import { evmToSubstrateAddress } from "../hydradxUtil";

export default function useRealAddress() {
  const user = useUser();
  const chain = useChain();

  const realAddress = user?.proxyAddress || user?.address;

  if (chain === Chains.hydradx && isEthereumAddress(realAddress)) {
    return evmToSubstrateAddress(realAddress);
  }

  return realAddress;
}
