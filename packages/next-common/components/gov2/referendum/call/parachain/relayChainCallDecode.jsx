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
import { RelayChainBlockApiProvider } from "next-common/context/relayChain/blockApi";
import useReferendumVotingFinishHeight, {
  useReferendaIsVoting,
} from "next-common/context/post/referenda/useReferendumVotingFinishHeight";

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

  return (
    <RelayChainBlockLoader>
      <RelayChainCallDecoder bytesArr={relayChainCallBytesArr} />
    </RelayChainBlockLoader>
  );
}

function RelayChainBlockLoader({ children }) {
  const blockHeight = useReferendumVotingFinishHeight();
  const isVoting = useReferendaIsVoting();

  if (!isVoting && !blockHeight) {
    return null;
  }

  return (
    <RelayChainBlockApiProvider blockHeight={blockHeight}>
      {children}
    </RelayChainBlockApiProvider>
  );
}

function RelayChainCallDecoder({ bytesArr }) {
  const { value: relayChainDecodes } = useRelayChainCallDecode(bytesArr);

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
          renderItem={({ json, raw }, index) => (
            <DecodeCallItem
              key={`relay-chain-call-decode-${index}`}
              decode={json}
              rawCall={raw}
              method={raw?.method}
              section={raw?.section}
            />
          )}
        />,
      ]}
    />
  );
}
