import useApi from "../../../utils/hooks/useApi";
import { useEffect, useState } from "react";
import normalizeCall from "./normalize";

export async function decodeCall(bytes = [], blockHash, api) {
  let blockApi = api;
  if (blockHash) {
    blockApi = await api.at(blockHash);
  }

  try {
    const proposal = blockApi.registry.createType("Proposal", bytes);
    const hash = proposal.hash.toString();
    const call = normalizeCall(proposal);
    return { hash, call };
  } catch (e) {
    console.error(e);
    return null;
  }
}

export default function useInlineCall(timeline, proposal) {
  const api = useApi();

  const [inline, setInline] = useState({
    hash: null,
    call: null,
  });

  useEffect(() => {
    if (!proposal?.inline || !api) {
      return;
    }

    const voteFinished = timeline.find((item) =>
      ["Passed", "NotPassed"].includes(item.method),
    );
    decodeCall(proposal.inline, voteFinished?.indexer?.blockHash, api).then(
      (callInfo) => {
        if (callInfo) {
          setInline(callInfo);
        }
      },
    );
  }, [proposal, timeline, api]);

  return inline;
}
