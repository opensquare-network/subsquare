import { useEffect, useState } from "react";
import normalizeCall from "./normalize";
import { useConditionalContextApi } from "next-common/context/migration/conditionalApi";

export async function decodeCall(bytes = [], api) {
  try {
    const proposal = api.registry.createType("Proposal", bytes);
    const hash = proposal.hash.toString();
    const call = normalizeCall(proposal);
    return { hash, call };
  } catch (e) {
    console.error(e);
    return null;
  }
}

export default function useInlineCall(proposal) {
  const api = useConditionalContextApi();

  const [inline, setInline] = useState({
    hash: null,
    call: null,
  });

  useEffect(() => {
    if (!proposal?.inline || !api) {
      return;
    }

    decodeCall(proposal.inline, api).then((callInfo) => {
      if (callInfo) {
        setInline(callInfo);
      }
    });
  }, [proposal, api]);

  return inline;
}
