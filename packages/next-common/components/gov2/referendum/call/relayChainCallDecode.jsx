"use client";

import { isObject } from "lodash-es";
import { DecodeCallItem } from "./decodeItem";
import Row from "next-common/components/listInfo/row";
import DecodeCallList from "./decodeList";

export default function RelayChainCall({ call }) {
  const { value: relayChainDecodes } = useRelayChainCallDecodeType(call);

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

export function useRelayChainCallDecodeType() {
  return {
    value: [],
    loading: false,
  };
}
