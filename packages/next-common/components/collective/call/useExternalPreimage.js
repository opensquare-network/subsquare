import { useContextApi } from "next-common/context/api";
import { useEffect, useState } from "react";
import normalizeCall from "next-common/components/democracy/metadata/normalize";

async function queryPreimage(api, hash, len, blockHash) {
  let blockApi = api;
  if (blockHash) {
    blockApi = await api.at(blockHash);
  }

  const raw = await blockApi.query.preimage.preimageFor([hash, len]);
  if (!raw.isSome) {
    return null;
  }

  const bytes = raw.unwrap();
  const hex = bytes.toHex();
  const proposal = api.registry.createType("Proposal", bytes);
  return {
    hex,
    normalized: normalizeCall(proposal),
  };
}

export default function useExternalPreimage(call, blockHash) {
  const api = useContextApi();
  const [preimage, setPreimage] = useState(null);

  if (!call) {
    return null;
  }

  const { section, method, args = [] } = call;
  if ("democracy" !== section) {
    return null;
  }

  if (!["externalProposeMajority"].includes(method)) {
    return null;
  }

  if (!args[0]?.value?.lookup) {
    return null;
  }

  const { hash, len } = args[0]?.value?.lookup;
  useEffect(() => {
    if (!api) {
      return;
    }

    queryPreimage(api, hash, len, blockHash).then((preimage) => {
      setPreimage(preimage);
    });
  }, [api, hash, len, blockHash]);

  return preimage;
}
