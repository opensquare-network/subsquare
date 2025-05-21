import { RawCallContext } from "next-common/context/call/raw";
import { useContext } from "react";
import { findAllCollectivesCalls } from "next-common/utils/gov2/crossChainCall";
import Row from "next-common/components/listInfo/row";
import DecodeCallList from "../decodeList";
import { DecodeCallItem } from "../decodeItem";
import ChainIcon from "next-common/components/header/chainIcon";
import { getParaChain } from "next-common/components/assets/paraChainTeleportPopup/teleportFromRelayChainToParaChain";
import Tooltip from "next-common/components/tooltip";
import { useCrossChainCallDecode } from "next-common/utils/gov2/useCrossChainCallDecode";
import getChainSettings from "next-common/utils/consts/settings";

export default function CrossChainCall() {
  const { call } = useContext(RawCallContext);

  if (!call) {
    return null;
  }
  // todo: currently we only support collectives call
  const collectivesCalls = findAllCollectivesCalls(call);
  if (!collectivesCalls.length) {
    return null;
  }
  return <CrossChainDecodeCall calls={collectivesCalls} />;
}

function CrossChainDecodeCall({ calls }) {
  const { value: decodes } = useCrossChainCallDecode(calls);
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
            const chain = getParaChain(parachainId.toNumber());
            const chainSettings = getChainSettings(chain);
            const chainName = chainSettings?.name || chain;
            const content = `Chain Name: ${chainName}\nChain ID: ${parachainId.toHuman()}`;
            return (
              <DecodeCallItem
                key={`cross-chain-call-decode-${index}`}
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
