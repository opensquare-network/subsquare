import { RawCallContext } from "next-common/context/call/raw";
import { useContext } from "react";
import { findAllSupportedParachainCalls } from "next-common/utils/gov2/relayToParachainCall";
import Row from "next-common/components/listInfo/row";
import DecodeCallList from "../decodeList";
import { DecodeCallItem } from "../decodeItem";
import ChainIcon from "next-common/components/header/chainIcon";
import Tooltip from "next-common/components/tooltip";
import { useRelayToParachainDecode } from "next-common/utils/gov2/useRelayToParachainDecode";
import { getParachain } from "next-common/utils/gov2/relayToParachainDecodeSupport";
import { getChainSettingsPolyfill } from "next-common/utils/consts/settingsPolyfill";

export default function RelayToParaChainCall() {
  const { call } = useContext(RawCallContext);

  if (!call) {
    return null;
  }
  const supportedParachainCalls = findAllSupportedParachainCalls(call);
  if (!supportedParachainCalls.length) {
    return null;
  }
  return <ParachainChainDecodeCall calls={supportedParachainCalls} />;
}

function ParachainChainDecodeCall({ calls }) {
  const { value: decodes } = useRelayToParachainDecode(calls);
  if (!decodes?.length) {
    return null;
  }

  return (
    <Row
      row={[
        "Cross-chain Call",
        <DecodeCallList
          key="decode-call-list"
          list={decodes}
          renderItem={({ json, raw, parachainId }, index) => {
            const chain = getParachain(parachainId.toNumber());
            if (!chain) {
              return null;
            }
            const chainSettings = getChainSettingsPolyfill(chain);
            const chainName = chainSettings?.name || chain;
            const content = `Chain Name: ${chainName}\nChain ID: ${parachainId.toHuman()}`;
            return (
              <DecodeCallItem
                key={`parachain-chain-decode-call-${index}`}
                beforeElement={
                  <Tooltip
                    className="!h-6 block"
                    contentClassName="whitespace-pre-wrap"
                    content={content}
                  >
                    <ChainIcon chain={chain} />
                  </Tooltip>
                }
                decode={json}
                rawCall={raw}
                method={raw?.method}
                section={raw?.section}
              />
            );
          }}
        />,
      ]}
    />
  );
}
