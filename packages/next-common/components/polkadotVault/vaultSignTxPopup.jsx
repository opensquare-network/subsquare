import Popup from "../popup/wrapper/Popup";
import { useState, useCallback, useEffect } from "react";
import { QrSigner } from "next-common/utils/qrSigner";
import { BN } from "@polkadot/util";
import { useUser } from "next-common/context/user";
import { sendSubstrateTx } from "next-common/utils/sendTransaction";
import { CMD_HASH, CMD_MORTAL } from "./const";
import DisplayPayloadAndScanContent from "./displayPayloadAndScanContent";

export default function VaultSignTxPopup({
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
      await sendSubstrateTx({
        tx,
        onStarted,
        onSubmitted,
        onInBlock,
        onFinalized,
        onError,
      });
    } catch (error) {
      onError(error);
    }
  }, [
    address,
    api,
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

  const _onClose = () => {
    qrReject?.(new Error("Rejected by user"));
    setQrState({});
    onClose?.();
  };

  if (!tx || !genesisHash || signed || !qrAddress) {
    return null;
  }
  return (
    <Popup title="Authorize Transaction" onClose={_onClose}>
      {qrAddress && (
        <div>
          <Qr
            qrAddress={qrAddress}
            isQrHashed={isQrHashed}
            genesisHash={genesisHash}
            qrPayload={qrPayload}
            onSignature={_addQrSignature}
          />
        </div>
      )}
    </Popup>
  );
}

function Qr({ qrAddress, genesisHash, isQrHashed, onSignature, qrPayload }) {
  const onScan = ({ signature }) => {
    if (signature) {
      onSignature({ signature });
    }
  };

  const onError = (error) => {
    console.error("QR scan error:", error);
  };

  return (
    <DisplayPayloadAndScanContent
      payloadParams={{
        address: qrAddress,
        cmd: isQrHashed ? CMD_HASH : CMD_MORTAL,
        payload: qrPayload,
        genesisHash,
      }}
      onScan={onScan}
      onError={onError}
    />
  );
}
