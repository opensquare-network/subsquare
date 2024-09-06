import { useEffect, useState } from "react";
import { useMountedState } from "react-use";
import { u8aConcat } from "@polkadot/util";
import { Kintsugi, Interlay } from "@interlay/monetary-js";
import Chains from "../consts/chains";
import { useChain } from "../../context/chain";
import { useTreasuryPallet } from "next-common/context/treasury";
import { encodeAddressToChain } from "next-common/services/address";

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
    setAccount(encodeAddressToChain(treasuryAccount, chain));
  }, [api]);

  return account;
}

export default function useTreasuryFree(api) {
  const chain = useChain();
  const [free, setFree] = useState(null);
  const isMounted = useMountedState();
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
          if (isMounted()) {
            setFree(accountData ? accountData.free.toString() : "0");
          }
        });
    } else {
      api?.query.system.account?.(treasuryAccount).then((accountData) => {
        if (isMounted()) {
          setFree(accountData ? accountData.data.free.toString() : "0");
        }
      });
    }
  }, [api, chain, treasuryAccount]);

  return free;
}
