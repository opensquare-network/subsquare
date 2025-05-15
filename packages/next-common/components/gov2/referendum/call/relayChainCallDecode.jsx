"use client";

import { DecodeCallItem } from "./decodeItem";
import Row from "next-common/components/listInfo/row";
import DecodeCallList from "./decodeList";
import {
  isXcmCall,
  isFromParaToRelayChain,
  getXcmEncodeds,
} from "next-common/utils/gov2/relayChainCall";
import { useRelayChainCallDecode } from "next-common/utils/gov2/useRelayChainCallDecode";

export default function RelayChainCall({ call }) {
  if (!isXcmCall(call)) {
    return null;
  }

  const locationArg = call?.args?.[0];
  if (!locationArg || !isFromParaToRelayChain(locationArg)) {
    return null;
  }

  const messageArg = call?.args?.[1];
  if (!messageArg) {
    return null;
  }

  const encodeds = getXcmEncodeds(messageArg);

  if (!encodeds?.length) {
    return null;
  }

  return <RelayChainCallImpl encodeds={encodeds} />;
}

function RelayChainCallImpl({ encodeds }) {
  const { value: relayChainDecodes } = useRelayChainCallDecode(encodeds);

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
