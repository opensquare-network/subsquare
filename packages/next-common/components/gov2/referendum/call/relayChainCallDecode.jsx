"use client";

import { DecodeCallItem } from "./decodeItem";
import Row from "next-common/components/listInfo/row";
import DecodeCallList from "./decodeList";
import { useAsync } from "react-use";
import { extractXcmContext } from "next-common/utils/gov2/relayChainCall";
import { useRelayChainCallDecode } from "next-common/utils/gov2/useRelayChainCallDecode";

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
  const { value: relayChainDecodes } = useRelayChainCallDecode(encodeCalls);

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
              key={`relay-chain-call-decode-${index}`}
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
