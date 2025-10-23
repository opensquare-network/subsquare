import { useEffect, useState } from "react";
import normalizeCall from "next-common/components/democracy/metadata/normalize";
import getExternalProposalHash from "next-common/components/collective/call/external";
import { isNil } from "lodash-es";
import { useConditionalContextApi } from "next-common/context/migration/conditionalApi";

async function queryPreimage(api, hash, len) {
  const raw = await api.query.preimage.preimageFor([hash, len]);
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

export default function useExternalPreimage(call) {
  const api = useConditionalContextApi();
  const [preimage, setPreimage] = useState(null);

  const { hash, len } = getExternalProposalHash(call) || {};
  useEffect(() => {
    if (!api || !hash || isNil(len)) {
      return;
    }

    queryPreimage(api, hash, len).then((preimage) => {
      setPreimage(preimage);
    });
  }, [api, hash, len]);

  return preimage;
}
