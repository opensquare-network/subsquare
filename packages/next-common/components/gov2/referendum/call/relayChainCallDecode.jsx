"use client";

import { DecodeCallItem } from "./decodeItem";
import Row from "next-common/components/listInfo/row";
import DecodeCallList from "./decodeList";
import { useAsync } from "react-use";
import { extractXcmContext } from "next-common/utils/gov2/relayChainCall";
import { useRelayChainCallDecode } from "next-common/utils/gov2/useRelayChainCallDecode";

export default function RelayChainCall({ call }) {
  const { value: xcmContext } = useAsync(async () => {
    return extractXcmContext(call) || {};
  });

  if (!xcmContext) {
    return null;
  }

  return <RelayChainCallImpl xcmContext={xcmContext} />;
}

function RelayChainCallImpl({ xcmContext }) {
  const { value: relayChainDecodes } = useRelayChainCallDecode(xcmContext);

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
