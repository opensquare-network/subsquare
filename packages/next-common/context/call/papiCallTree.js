import { createContext, useContext } from "react";
import { useEffect, useState } from "react";
import { useContextPapi } from "next-common/context/papi";
import { useOnchainData } from "next-common/context/post";
import { Binary } from "polkadot-api";
import {
  decodeCallTree,
  getMetadata,
} from "next-common/utils/callDecoder/decoder.mjs";

async function fetchPreimage(papi, preimageHash) {
  const status = await papi.query.Preimage.RequestStatusFor.getValue(
    Binary.fromHex(preimageHash),
  );

  if (!status) {
    return null;
  }

  const preimageLen = status.value.len || status.value.maybe_len;

  // console.log({
  //   preimageHash,
  //   preimageLen,
  // });

  const preimage = await papi.query.Preimage.PreimageFor.getValue([
    Binary.fromHex(preimageHash),
    preimageLen,
  ]);

  return preimage;
}

async function getPreimageCall(client, papi, preimageHash) {
  const preimage = await fetchPreimage(papi, preimageHash);
  const bytes = preimage.asBytes();
  const metadata = await getMetadata(client);
  return decodeCallTree(bytes, metadata);
}

function useReferendumCall() {
  const [callTreeData, setCallTreeData] = useState(null);
  const onchainData = useOnchainData();
  const { proposalHash } = onchainData || {};
  const { api, client } = useContextPapi();
  // console.log({ callTreeData });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!api) {
      return;
    }

    setLoading(true);
    getPreimageCall(client, api, proposalHash)
      .then(setCallTreeData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [api, client, proposalHash]);

  return {
    isLoading: loading,
    callTreeData,
  };
}

export const PapiCallTreeContext = createContext(null);

export default function PapiCallTreeProvider({ children }) {
  const { callTreeData, isLoading } = useReferendumCall();

  return (
    <PapiCallTreeContext.Provider value={{ callTreeData, isLoading }}>
      {children}
    </PapiCallTreeContext.Provider>
  );
}

export function usePapiCallTree() {
  return useContext(PapiCallTreeContext);
}
