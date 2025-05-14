"use client";

import { useState, useEffect } from "react";
import { isObject } from "lodash-es";
import { useAsync } from "react-use";
import { getApi } from "next-common/services/chain/api";
import { getRelayChain, isCollectivesChain } from "next-common/utils/chain";
import { useChain } from "next-common/context/chain";
import { DecodeCallItem } from "./decodeItem";
import { useOnchainData } from "next-common/context/post";
import Row from "next-common/components/listInfo/row";
import DecodeCallList from "./decodeList";
import { useContextApi } from "next-common/context/api";

export function RelayChainCall() {
  const chain = useChain();
  const onchainData = useOnchainData();
  const proposal = onchainData?.proposal ?? {};
  const inlineCall = onchainData?.inlineCall || {};
  const call = proposal?.call || inlineCall?.call;

  if (!isCollectivesChain(chain) || !call) {
    return null;
  }

  return <RelayChainCallDecodeViewList call={call} />;
}

export default function RelayChainCallDecodeViewList({ call }) {
  const { value: relayChaindecodes } = useRelayChainCallDecodeType(call);

  if (!relayChaindecodes?.length) {
    return null;
  }

  return (
    <Row
      row={[
        "Relay chain call",
        <DecodeCallList
          key="element"
          list={relayChaindecodes}
          renderItem={(item, index) => (
            <DecodeCallItem
              key={`RelayChainCallDecode-${index}`}
              decode={item}
              method={item?.method}
              section={item?.section}
            />
          )}
        />,
      ]}
    />
  );
}

export async function extractRelayChainInputsWithContext(data) {
  const encodedResults = [];

  async function findEncoded(item) {
    if (!isObject(item)) {
      return;
    }

    if (Array.isArray(item)) {
      await Promise.all(item.map(findEncoded));
      return;
    }

    if (item.encoded && typeof item.encoded === "string") {
      encodedResults.push(item.encoded);
    }

    await Promise.all(Object.values(item).map(findEncoded));
  }

  await findEncoded(data);
  return encodedResults;
}

export function useRelayChainCallDecodeType(data) {
  const chain = useChain();
  const relayChain = getRelayChain(chain);
  const api = useContextApi();
  const [decodes, setDecodes] = useState([]);
  const [loading, setLoading] = useState(false);

  const { value } = useAsync(async () =>
    extractRelayChainInputsWithContext(data),
  );

  useEffect(() => {
    const relayApi = getApi(relayChain, "wss://rpc.polkadot.io");
    const decodes = [];
    setLoading(true);
    relayApi
      .then(async (api) => {
        // await api.at(
        //   "0x8e4038ef30250aefb0d7349ae2c24434c5a24c7e67da5d3c9fd6bb668a22cb91",
        // );
        return api;
      })
      .then((api) => {
        if (api && value?.length) {
          for (const encode of value) {
            try {
              const result = api?.registry?.createType("Call", encode);
              const json = result?.toHuman();
              if (json) {
                decodes.push(json);
              }
            } catch (error) {
              console.error(error);
            }
          }
        }
        setDecodes(decodes);
      });

    setLoading(false);
  }, [value, relayChain]);

  return {
    value: decodes,
    loading,
  };
}
