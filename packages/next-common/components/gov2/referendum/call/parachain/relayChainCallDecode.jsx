"use client";

import { DecodeCallItem } from "../decodeItem";
import Row from "next-common/components/listInfo/row";
import DecodeCallList from "../decodeList";
import {
  isXcmCall,
  isFromParaToRelayChain,
  extractTransactCallBytesArr,
} from "next-common/utils/gov2/relayChainCall";
import { useRelayChainCallDecode } from "next-common/utils/gov2/useRelayChainCallDecode";
import { RawCallContext } from "next-common/context/call/raw";
import { useContext } from "react";

export default function RelayChainCall() {
  const { call, isLoading } = useContext(RawCallContext);
  if (isLoading || !isXcmCall(call)) {
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

  const relayChainCallBytesArr = extractTransactCallBytesArr(messageArg);
  return <RelayChainCallImpl encodeds={relayChainCallBytesArr} />;
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
