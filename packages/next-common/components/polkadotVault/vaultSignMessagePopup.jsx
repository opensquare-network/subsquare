import { useMemo } from "react";
import Popup from "../popup/wrapper/Popup";
import { u8aWrapBytes } from "@polkadot/util";
import { blake2AsHex } from "@polkadot/util-crypto";
import { CMD_SIGN_MESSAGE } from "./const";
import DisplayPayloadAndScaner from "./displayPayloadAndScanContent";

export default function VaultSignMessagePopup({
  onClose,
  resolve,
  reject,
  address,
  genesisHash,
  message,
}) {
  const messageBytes = useMemo(() => {
    return u8aWrapBytes(blake2AsHex(message));
  }, [message]);

  const onScan = ({ signature }) => {
    if (signature) {
      onClose();
      resolve({ signature });
    }
  };

  const onError = (error) => {
    reject?.(error);
  };
  const _onClose = () => {
    reject?.(new Error("Rejected by user"));
    onClose();
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
