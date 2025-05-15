"use client";

import { DecodeCallItem } from "./decodeItem";
import Row from "next-common/components/listInfo/row";
import DecodeCallList from "./decodeList";
import getChainSettings from "next-common/utils/consts/settings";
import {
  getBlockApiByHeight,
  getOriginApi,
} from "next-common/services/chain/api";
import { useAsync } from "react-use";
import { CHAIN } from "next-common/utils/constants";
import { getRelayChain } from "next-common/utils/chain";
import { useEffect, useMemo, useState } from "react";
import { useContextApi } from "next-common/context/api";
import { useOnchainData } from "next-common/context/post";

const apiMap = new Map();

export default function RelayChainCall({ call }) {
  const { value: encodeCalls } = useAsync(async () => {
    return (await extractXcmContext(call)) || {};
  });

  if (!encodeCalls?.length) {
    return null;
  }

  return <RelayChainCallImpl encodeCalls={encodeCalls} />;
}

function RelayChainCallImpl({ encodeCalls }) {
  const { value: relayChainDecodes } = useRelayChainCallDecodeType(encodeCalls);

  if (!relayChainDecodes?.length) {
    return null;
  }

  return (
    <Row
      row={[
        "Relay chain call",
        <DecodeCallList
          key="element"
          list={relayChainDecodes}
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

function useReferendaIsActived() {
  const onchainData = useOnchainData();
  return useMemo(() => {
    const name = onchainData?.state?.name;
    return ["DecisionDepositPlaced", "DecisionStarted"].includes(name);
  }, [onchainData]);
}

function useRealyChainBlockNumber() {
  const api = useContextApi();
  const onchainData = useOnchainData();
  const isActived = useReferendaIsActived();
  const [relayChainBlockNumber, setRelayChainBlockNumber] = useState();

  console.log(api);

  useEffect(() => {
    if (!isActived && api) {
      const confirmedTl = onchainData.timeline.find(
        (tl) => tl.name === "Submitted",
      );
      const blockHeight = confirmedTl.indexer.blockHeight;
      if (blockHeight) {
        getBlockApiByHeight(api, blockHeight)
          .then((atApi) =>
            atApi?.query?.parachainSystem.lastRelayChainBlockNumber(),
          )
          .then((res) => res.toNumber())
          .then((relayNumber) => setRelayChainBlockNumber(relayNumber));
      }
    }
  }, [api, isActived, onchainData]);

  return {
    relayChainBlockNumber,
  };
}

export function useRelayChainCallDecodeType(encodeCalls) {
  const [results, setResults] = useState([]);
  const { relayChainBlockNumber } = useRealyChainBlockNumber();

  console.log("relayChainBlockNumber", relayChainBlockNumber);

  useEffect(() => {
    const decodeResults = [];
    async function decode() {
      for (const { destChainId, encodedCalls: calls } of encodeCalls) {
        if (calls.length) {
          const destApi = await getDestApi(destChainId);
          const destApiAt = await getBlockApiByHeight(
            destApi,
            relayChainBlockNumber,
          );
          for (const call of calls) {
            const result = destApiAt?.registry?.createType("Call", call);
            if (result) {
              decodeResults.push(result.toHuman?.());
            }
          }
          setResults(decodeResults);
        }
      }
      clearDestApi();
    }
    if (encodeCalls?.length && relayChainBlockNumber) {
      decode();
    }
  }, [encodeCalls, relayChainBlockNumber]);

  return {
    value: results,
    loading: false,
  };
}

export async function extractXcmContext(data) {
  if (!data || data.section !== "polkadotXcm") {
    return null;
  }

  const dest = data.args[0]?.value;
  const message = data.args[1]?.value;
  const destChainId = parseDestChainId(dest);

  const encodedCalls = [];
  if (message.v4 && Array.isArray(message.v4)) {
    message.v4.forEach((instruction) => {
      if (instruction.transact?.call?.encoded) {
        encodedCalls.push(instruction.transact.call.encoded);
      }
    });
  }

  return [
    {
      destChainId,
      encodedCalls,
    },
  ];
}

function parseDestChainId(dest) {
  if (!dest.v4) return null;
  const { parents, interior } = dest.v4;

  if (parents === 1 && interior.here === null) {
    return "0";
  }
  if (parents === 1 && interior.X1?.Parachain) {
    return interior.X1.Parachain.toString();
  }
  if (parents === 1 && interior.X2?.[0]?.Parachain) {
    return interior.X2[0].Parachain.toString();
  }
  return null;
}

function getDestApi(destChainId) {
  const chainMap = {
    0: getRelayChain(CHAIN),
  };
  const chain = chainMap[destChainId];
  if (!chain) {
    return null;
  }
  const { endpoints } = getChainSettings(chain);
  const endpoint = endpoints[0]?.url;

  if (!apiMap.get(endpoint)) {
    apiMap.set(endpoint, getOriginApi(chain, endpoint));
  }

  return apiMap.get(endpoint);
}

function clearDestApi() {
  apiMap.forEach(async (api) => {
    (await api)?.disconnect();
  });
  apiMap.clear();
}
