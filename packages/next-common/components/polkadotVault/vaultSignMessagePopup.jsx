import { useMemo } from "react";
import Popup from "../popup/wrapper/Popup";
import { u8aWrapBytes } from "@polkadot/util";
import { blake2AsHex } from "@polkadot/util-crypto";
import { CMD_SIGN_MESSAGE } from "./const";
import DisplayPayloadAndScaner from "./displayPayloadAndScanContent";
import { noop } from "lodash-es";

export default function VaultSignMessagePopup({
  onComplete = noop,
  onCancel = noop,
  address,
  genesisHash,
  message,
}) {
  const messageBytes = useMemo(() => {
    return u8aWrapBytes(blake2AsHex(message));
  }, [message]);

  const onScan = ({ signature }) => {
    if (signature) {
      onComplete({ signature });
    }
  };

  const onError = (error) => {
    onCancel?.(error);
  };
  const _onClose = () => {
    onCancel?.(new Error("Rejected by user"));
  };

  return (
    <Popup title="Signature Request" onClose={_onClose}>
      <DisplayPayloadAndScaner
        payloadParams={{
          address,
          cmd: CMD_SIGN_MESSAGE,
          payload: messageBytes,
          genesisHash,
        }}
        onScan={onScan}
        onError={onError}
      />
    </Popup>
  );
}
