import Popup from "../popup/wrapper/Popup";
import { useState, useCallback, useEffect, useMemo } from "react";
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
  const [{ isQrHashed, qrAddress, qrPayload }, setQrState] = useState({});

  const qrSigner = useMemo(() => {
    if (!api?.registry) {
      return null;
    }
    return new QrSigner(api.registry, setQrState);
  }, [api]);

  const signAsyncOptions = useMemo(() => {
    if (!qrSigner) {
      return null;
    }
    return {
      assetId: undefined,
      feeAsset: null,
      nonce: -1,
      tip: new BN("0"),
      withSignedTransaction: true,
      signer: qrSigner,
    };
  }, [qrSigner]);

  const startTransaction = useCallback(async () => {
    if (!signAsyncOptions) {
      return;
    }
    try {
      setSigned(false);
      await tx.signAsync(address, signAsyncOptions);
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
    onError,
    onFinalized,
    onInBlock,
    onStarted,
    onSubmitted,
    tx,
    signAsyncOptions,
  ]);

  const onQrSignedCallback = useCallback(
    ({ signature }) => {
      qrSigner.resolveSignature?.({
        id: qrId,
        signature: signature,
      });
      setSigned(true);
      onClose?.();
    },
    [qrId, qrSigner, onClose],
  );

  useEffect(() => {
    if (api && tx) {
      startTransaction();
    }
  }, [api, startTransaction, tx]);

  const _onClose = () => {
    qrSigner.rejectSignature?.(new Error("Rejected by user"));
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
            onSignature={onQrSignedCallback}
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
