import Popup from "../popup/wrapper/Popup";
import { QrDisplayPayload, QrScanSignature } from "@polkadot/react-qr";
import { useState, useCallback, useEffect } from "react";
import { QrSigner } from "next-common/utils/qrSigner";
import { BN } from "@polkadot/util";
import { useUser } from "next-common/context/user";

const CMD_HASH = 1;
const CMD_MORTAL = 2;

export default function VaultSignerPopup({
  tx,
  api,
  qrId,
  onClose,
  onStarted,
  onError,
  onSubmitted,
  onInBlock,
  onFinalized,
}) {
  const [signed, setSigned] = useState(false);
  const user = useUser();
  const address = user?.address;
  const genesisHash = api?.genesisHash;
  const [
    { isQrHashed, qrAddress, qrPayload, qrResolve, qrReject },
    setQrState,
  ] = useState({});

  const start = useCallback(async () => {
    onStarted?.();
    try {
      const options = {
        assetId: undefined,
        feeAsset: null,
        nonce: -1,
        tip: new BN("0"),
        withSignedTransaction: true,
        signer: new QrSigner(api.registry, setQrState),
      };
      setSigned(false);
      await tx.signAsync(address, options);
      const unsub = await tx.send((result) => {
        const { status, txHash } = result;

        if (status.isBroadcast) {
          onSubmitted?.(result, txHash.toHex());
        }

        if (status.isInBlock) {
          onInBlock?.(result, txHash.toHex());
        }

        if (status.isFinalized) {
          onFinalized?.(result, txHash.toHex());
          unsub && unsub();
        }
      });
    } catch (error) {
      onError(error);
    }
  }, [
    address,
    api?.registry,
    onError,
    onFinalized,
    onInBlock,
    onStarted,
    onSubmitted,
    tx,
  ]);

  const _addQrSignature = useCallback(
    ({ signature }) => {
      qrResolve?.({
        id: qrId,
        signature: signature,
      }),
        setSigned(true);
    },
    [qrId, qrResolve],
  );

  useEffect(() => {
    if (api && tx) {
      start();
    }
  }, [api, start, tx]);

  if (!tx || !genesisHash || signed || !qrAddress) {
    return null;
  }

  const _onClose = () => {
    qrReject?.(new Error("Rejected by user"));
    setQrState({});
    onClose?.();
  };

  return (
    <Popup title="Authorize Transaction" onClose={_onClose}>
      <div>
        <p>Scan the QR code with your vault app</p>
        <Qr
          qrAddress={qrAddress}
          isQrHashed={isQrHashed}
          genesisHash={genesisHash}
          qrPayload={qrPayload}
          onSignature={_addQrSignature}
        />
      </div>
    </Popup>
  );
}

function Qr({ qrAddress, genesisHash, isQrHashed, onSignature, qrPayload }) {
  return (
    <div>
      <div className="w-150px">
        <QrDisplayPayload
          className="flex justify-center"
          style={{
            width: 200,
          }}
          address={qrAddress}
          cmd={isQrHashed ? CMD_HASH : CMD_MORTAL}
          genesisHash={genesisHash}
          payload={qrPayload}
        />
      </div>
      <p>Show Sign QR code</p>
      <div className="p-4 bg-neutral-100 rounded-md">
        <QrScanSignature onScan={onSignature} />
      </div>
    </div>
  );
}
