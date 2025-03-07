import { useEffect, useState } from "react";
import { useOnchainData } from "next-common/context/post";
import useBlockApi from "next-common/utils/hooks/useBlockApi";
import { createGlobalState } from "react-use";
import { isNil } from "lodash-es";
import getCallByPreimageHash from "next-common/services/preimages/call";
import RawCallProvider from "next-common/context/call/raw";

const useCachedResult = createGlobalState({});

function useDemocracyReferendumCall() {
  const onchainData = useOnchainData();
  const { hash, indexer } = onchainData;
  const api = useBlockApi(indexer?.blockHash);

  const [cachedResult, setCachedResult] = useCachedResult({});
  const result = cachedResult[hash] || null;
  const [loading, setLoading] = useState(isNil(result));

  useEffect(() => {
    if (!api || !hash) {
      return;
    }

    setLoading(true);
    getCallByPreimageHash(api, hash)
      .then((result) => {
        setCachedResult((val) => ({ ...val, [hash]: result }));
      })
      .finally(() => setLoading(false));
  }, [api, hash, setCachedResult]);

  return {
    isLoading: loading,
    call: result,
  };
}

export default function DemocracyReferendumCallProvider({ children }) {
  const { call, isLoading } = useDemocracyReferendumCall();

  return (
    <RawCallProvider call={call} isLoading={isLoading}>
      {children}
    </RawCallProvider>
  );
}
