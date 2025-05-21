import { RawCallContext } from "next-common/context/call/raw";
import { useContext, useEffect, useState } from "react";
import { findAllCollectivesCalls } from "next-common/utils/gov2/crossChainCall";
import Row from "next-common/components/listInfo/row";
import DecodeCallList from "../decodeList";
import { DecodeCallItem } from "../decodeItem";
import { convertDecodedCallToViewData } from "next-common/utils/gov2/useRelayChainCallDecode";
import ChainIcon from "next-common/components/header/chainIcon";
import { getParaChain } from "next-common/components/assets/paraChainTeleportPopup/teleportFromRelayChainToParaChain";
import Tooltip from "next-common/components/tooltip";
import useReferendumVotingFinishHeight, {
  useReferendaIsVoting,
} from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { useParachainApi } from "next-common/utils/gov2/useParachainApi";
import { useParachainsBlockNumber } from "next-common/utils/gov2/useParachainsBlockNumber";

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
  return <CrossChainDecodeCallList calls={collectivesCalls} />;
}

function CrossChainDecodeCallList({ calls }) {
  const blockHeight = useReferendumVotingFinishHeight();
  if (!blockHeight || !calls?.length) {
    return null;
  }
  return calls.map((call, index) => (
    <CrossChainDecodeCall
      key={index}
      parachainId={call.parachainId}
      bytesArr={call.bytesArr}
      blockHeight={blockHeight}
    />
  ));
}

function CrossChainDecodeCall({ parachainId, bytesArr, blockHeight }) {
  const isVoting = useReferendaIsVoting();
  const parachainIdNumber = parachainId.toNumber();
  const { parachainsBlockNumber } = useParachainsBlockNumber(
    parachainIdNumber,
    !isVoting ? blockHeight : null,
  );

  const api = useParachainApi(parachainIdNumber, parachainsBlockNumber);
  const [decodes, setDecodes] = useState([]);

  useEffect(() => {
    async function decode() {
      const decodes = [];
      for (const bytes of bytesArr) {
        const result = api?.registry?.createType("Call", bytes);
        if (result) {
          const json = convertDecodedCallToViewData(result);
          decodes.push({
            json,
            raw: result,
          });
        }
      }
      setDecodes(decodes);
    }
    if ((!isVoting && !parachainsBlockNumber) || !api || !bytesArr.length) {
      return;
    }
    decode();
  }, [api, bytesArr, isVoting, parachainsBlockNumber]);

  if (!decodes.length) {
    return null;
  }

  return (
    <Row
      row={[
        "Cross-chain Call",
        <DecodeCallList
          key="decode-call-list"
          list={decodes}
          renderItem={({ json, raw }, index) => {
            const chain = getParaChain(parachainIdNumber);
            const content = `Chain Name: ${chain}\nChain ID: ${parachainId.toHuman()}`;
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
