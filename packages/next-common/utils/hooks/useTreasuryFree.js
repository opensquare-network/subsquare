import { useEffect, useState } from "react";
import useIsMounted from "./useIsMounted";
import { u8aConcat } from "@polkadot/util";
import { Kintsugi, Interlay } from "@interlay/monetary-js";
import Chains from "../consts/chains";

const EMPTY_U8A_32 = new Uint8Array(32);

export function useTreasuryAccount(api) {
  const [account, setAccount] = useState();

  useEffect(() => {
    if (!api) {
      return;
    }

    const treasuryAccount = u8aConcat(
      "modl",
      api?.consts.treasury && api.consts.treasury.palletId
        ? api.consts.treasury.palletId.toU8a(true)
        : "py/trsry",
      EMPTY_U8A_32
    ).subarray(0, 32);
    setAccount(treasuryAccount);
  }, [api]);

  return account;
}

export default function useTreasuryFree(api, chain) {
  const [free, setFree] = useState("0");
  const isMounted = useIsMounted();
  const treasuryAccount = useTreasuryAccount(api);

  useEffect(() => {
    if (!treasuryAccount) {
      return;
    }

    if ([Chains.kintsugi, Chains.interlay].includes(chain)) {
      const token =
        Chains.kintsugi === chain ? Kintsugi.ticker : Interlay.ticker;

      api.query.tokens
        .accounts(treasuryAccount, { token })
        .then((accountData) => {
          if (isMounted.current) {
            setFree(accountData ? accountData.free.toString() : "0");
          }
        });
    } else {
      api?.query.system.account(treasuryAccount).then((accountData) => {
        if (isMounted.current) {
          setFree(accountData ? accountData.data.free.toString() : "0");
        }
      });
    }
  }, [api, chain, treasuryAccount]);

  return free;
}
