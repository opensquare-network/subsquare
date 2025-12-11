import { useMemo } from "react";
import Popup from "../popup/wrapper/Popup";
import QrScannerComponent from "./scanner";
import { QrDisplayPayload } from "@polkadot/react-qr";
import { stringToU8a } from "@polkadot/util";

export default function VaultSignMessagePopup({
  onClose,
  resolve,
  reject,
  address,
  genesisHash,
  message,
}) {
  const messageBytes = useMemo(
    () => stringToU8a(`<Bytes>${message}</Bytes>`),
    [message],
  );

  const onScan = ({ data }) => {
    if (data) {
      const signature = `0x${data}`;
      onClose();
      resolve({ signature });
    }
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
          <QrScannerComponent onScan={onScan} />
        </div>
      </div>
    </Popup>
  );
}
