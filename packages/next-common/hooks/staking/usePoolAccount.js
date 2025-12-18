import { bnToU8a, stringToU8a, u8aConcat } from "@polkadot/util";
import { encodeAddress } from "@polkadot/util-crypto";
import { isNil } from "lodash-es";
import { useContextApi } from "next-common/context/api";
import { useMemo } from "react";

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

  return useMemo(() => {
    if (!api || isNil(poolId)) {
      return { stash: null, reward: null };
    }
    const poolsPalletId = api.consts.nominationPools.palletId;
    const stash = createAccount(
      0,
      poolId,
      poolsPalletId,
      api.registry.chainSS58,
    );
    const reward = createAccount(
      1,
      poolId,
      poolsPalletId,
      api.registry.chainSS58,
    );
    return { stash, reward };
  }, [api, poolId]);
}
