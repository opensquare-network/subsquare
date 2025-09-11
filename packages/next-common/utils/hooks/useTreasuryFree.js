import { useEffect, useState } from "react";
import { u8aConcat } from "@polkadot/util";
import { Kintsugi, Interlay } from "@interlay/monetary-js";
import Chains from "next-common/utils/consts/chains";
import { useChain } from "next-common/context/chain";
import { useTreasuryPallet } from "next-common/context/treasury";
import { encodeAddressToChain } from "next-common/services/address";
import isEvmChain from "next-common/utils/isEvmChain";

const EMPTY_U8A_32 = new Uint8Array(32);

export function useTreasuryAccount(api) {
  const [account, setAccount] = useState();
  const chain = useChain();
  const pallet = useTreasuryPallet();

  useEffect(() => {
    if (Chains.kintsugi === chain) {
      setAccount("a3cgeH7D28bBsHY4hGLzxkMFUcFQmjGgDa2kmxg3D9Z6AyhtL");
      return;
    } else if (Chains.interlay === chain) {
      setAccount("wd9yNSwR7YL4Y4PEtY4pUxYR2jeVdsgwyoN8fwVc9196VMAt4");
      return;
    } else if (Chains.collectives === chain) {
      // For collectives chain, return the treasury account on Polkadot AssetHub
      setAccount("16VcQSRcMFy6ZHVjBvosKmo7FKqTb8ZATChDYo8ibutzLnos");
      return;
    }

    if (!api) {
      return;
    }

    const treasuryAccount = u8aConcat(
      "modl",
      api?.consts[pallet] && api.consts[pallet].palletId
        ? api.consts[pallet].palletId.toU8a(true)
        : "py/trsry",
      EMPTY_U8A_32,
    ).subarray(0, 32);
    if (isEvmChain()) {
      setAccount(treasuryAccount);
    } else {
      setAccount(encodeAddressToChain(treasuryAccount, chain));
    }
  }, [api, chain, pallet]);

  return account;
}

export default function useTreasuryFree(api) {
  const chain = useChain();
  const [free, setFree] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const treasuryAccount = useTreasuryAccount(api);

  useEffect(() => {
    if (!treasuryAccount || !api) {
      return;
    }

    if ([Chains.kintsugi, Chains.interlay].includes(chain)) {
      const token =
        Chains.kintsugi === chain ? Kintsugi.ticker : Interlay.ticker;

      api.query.tokens
        .accounts(treasuryAccount, { token })
        .then((accountData) => {
          setFree(accountData ? accountData.free.toString() : "0");
          setIsLoading(false);
        });
    } else {
      api?.query.system.account?.(treasuryAccount).then((accountData) => {
        setFree(accountData ? accountData.data.free.toString() : "0");
        setIsLoading(false);
      });
    }
  }, [api, chain, treasuryAccount]);

  return { free, isLoading };
}
