import { GreyPanel } from "../styled/containers/greyPanel";
import { QrDisplayPayload, QrScanSignature } from "@polkadot/react-qr";
import { noop } from "lodash-es";

export default function DisplayPayloadAndScanContent({
  payloadParams = {},
  onScan = noop,
  onError = noop,
}) {
  return (
    <div className=" space-y-4">
      <GreyPanel className="text14Medium text-textSecondary px-4 py-2.5">
        <ol className="list-inside list-decimal">
          <li>Scan the QR code to sign in Polkadot Vault.</li>
          <li>Show the signed QR code for the app to scan</li>
        </ol>
      </GreyPanel>

      <div className="flex justify-evenly items-center">
        <div className="rounded-xl border border-neutral300 overflow-hidden p-4">
          <QrDisplayPayload className="m-auto" {...payloadParams} size={160} />
        </div>
        <div className="rounded-xl border border-neutral300 overflow-hidden p-4">
          <QrScanSignature
            className="rounded-md m-auto"
            onScan={onScan}
            onError={onError}
            size={160}
          />
        </div>
      </div>
    </div>
  );
}
