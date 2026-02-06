import { createContext, useContext } from "react";
import { useEffect, useState } from "react";
import { useContextPapi } from "next-common/context/papi";
import { useOnchainData } from "next-common/context/post";
import { Binary } from "polkadot-api";
import {
  decodeCallTree,
  getBlockMetadata,
} from "next-common/utils/callDecoder/decoder.mjs";

async function fetchPreimage(papi, preimageHash, blockHash) {
  const status = await papi.query.Preimage.RequestStatusFor.getValue(
    Binary.fromHex(preimageHash),
    { at: blockHash },
  );

  if (!status) {
    return null;
  }

  const preimageLen = status.value.len || status.value.maybe_len;

  // console.log({
  //   preimageHash,
  //   preimageLen,
  // });

  const preimage = await papi.query.Preimage.PreimageFor.getValue(
    [Binary.fromHex(preimageHash), preimageLen],
    { at: blockHash },
  );

  return preimage;
}

async function getPreimageCall(client, papi, preimageHash, blockHash) {
  const preimage = await fetchPreimage(papi, preimageHash, blockHash);
  if (!preimage) {
    return null;
  }
  const bytes = preimage.asBytes();
  const metadata = await getBlockMetadata(client, blockHash);
  if (!metadata) {
    return null;
  }
  return decodeCallTree(bytes, metadata);
}

async function decodeInlineCallHex(client, blockHash, inlineCallHex) {
  const bytes = Binary.fromHex(inlineCallHex).asBytes();
  const metadata = await getBlockMetadata(client, blockHash);
  if (!metadata) {
    throw new Error("Cannot get block metadata");
  }
  return decodeCallTree(bytes, metadata);
}

function useReferendumCall() {
  const [callTreeData, setCallTreeData] = useState(null);
  const onchainData = useOnchainData();
  const { proposalHash, indexer, inlineCall, proposal } = onchainData || {};
  const { client } = useContextPapi();
  const blockHash = proposal?.indexer?.blockHash || indexer?.blockHash;
  const { api } = useContextPapi();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!api || !blockHash) {
      return;
    }

    setLoading(true);

    if (inlineCall?.hex) {
      decodeInlineCallHex(client, blockHash, inlineCall.hex)
        .then(setCallTreeData)
        .catch(console.error)
        .finally(() => setLoading(false));
      return;
    }

    getPreimageCall(client, api, proposalHash, blockHash)
      .then(setCallTreeData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [api, client, proposalHash, blockHash, inlineCall]);

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
