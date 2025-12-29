import { useMemo } from "react";
import Popup from "../popup/wrapper/Popup";
import { QrDisplayPayload, QrScanSignature } from "@polkadot/react-qr";
import { u8aWrapBytes } from "@polkadot/util";
import { blake2AsHex } from "@polkadot/util-crypto";

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
      <div className=" space-y-4">
        <p className="text14Bold pb-1">
          1. Scan the QR code to sign in Polkadot Vault.
        </p>

        <div className="flex justify-center">
          <QrDisplayPayload
            address={address}
            cmd={3}
            payload={messageBytes}
            genesisHash={genesisHash}
            size={200}
          />
        </div>
        <p className="text14Bold pb-1">
          2. Show the signed QR code for the app to scan
        </p>
        <div className="p-4 bg-neutral-100 rounded-md">
          <QrScanSignature onScan={onScan} onError={onError} size={200} />
        </div>
      </div>
    </Popup>
  );
}
