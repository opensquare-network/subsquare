import { useContextApi } from "next-common/context/api";
import { useEffect, useState } from "react";
import { useBlockHeight } from "next-common/hooks/common/useBlockHeight";
import bigAdd from "next-common/utils/math/bigAdd";
import { u8aToHex } from "@polkadot/util";

async function queryEntries(api, startKey, num = 1000) {
  return api.query.escrow.locked.entriesPaged({
    args: [],
    pageSize: num,
    startKey,
  });
}

async function queryLocked(api) {
  let startKey = null;

  let totalStaked = 0;
  let totalAccount = 0;

  let entries = await queryEntries(api, startKey, 1000);
  while (entries.length > 0) {
    totalAccount += entries.length;
    for (const [, lockedBalance] of entries) {
      const balance = lockedBalance.amount.toString();
      totalStaked = bigAdd(totalStaked, balance);
    }

    startKey = u8aToHex(entries[entries.length - 1][0]);
    entries = await queryEntries(api, startKey, 1000);
  }

  return { totalStaked, totalAccount };
}

export default function useEscrowLocked() {
  const api = useContextApi();
  const height = useBlockHeight();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!api || !api.query?.escrow?.locked) {
      return;
    }

    queryLocked(api).then((result) => setData(result));
  }, [api, height]);

  return data;
}
