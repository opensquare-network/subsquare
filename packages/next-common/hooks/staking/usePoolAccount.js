import { bnToU8a, stringToU8a, u8aConcat } from "@polkadot/util";
import { encodeAddress } from "@polkadot/util-crypto";
import { isNil } from "lodash-es";
import { useContextApi } from "next-common/context/api";
import { useEffect, useState } from "react";

const createAccount = (index, poolId, poolsPalletId, ss58Format) => {
  const key = u8aConcat(
    stringToU8a("modl"),
    poolsPalletId,
    new Uint8Array([index]),
    bnToU8a(BigInt(poolId.toString())),
    new Uint8Array(32),
  ).slice(0, 32);
  return encodeAddress(key, ss58Format);
};

export function usePoolAccounts(poolId) {
  const api = useContextApi();
  const [stash, setStash] = useState(null);
  const [reward, setReward] = useState(null);

  useEffect(() => {
    if (!api || isNil(poolId)) {
      return;
    }
    const poolsPalletId = api.consts.nominationPools.palletId;
    setStash(createAccount(0, poolId, poolsPalletId, api.registry.chainSS58));
    setReward(createAccount(1, poolId, poolsPalletId, api.registry.chainSS58));
  }, [api, poolId]);

  return { stash, reward };
}
