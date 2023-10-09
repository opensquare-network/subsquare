import { useOnchainData } from "next-common/context/post";
import { useEffect, useState } from "react";
import useApi from "next-common/utils/hooks/useApi";
import { decodeCall } from "next-common/components/democracy/metadata/useInlineCall";

export default function useInlineCall() {
  const api = useApi();
  const onchainData = useOnchainData();
  const { indexer, proposal } = onchainData || {};
  const [call, setCall] = useState();

  useEffect(() => {
    if (!proposal?.inline || !api) {
      return;
    }

    decodeCall(proposal.inline, indexer?.blockHash, api).then((callInfo) => {
      if (callInfo) {
        setCall(callInfo?.call);
      }
    });
  }, [api, proposal]);

  return call;
}
