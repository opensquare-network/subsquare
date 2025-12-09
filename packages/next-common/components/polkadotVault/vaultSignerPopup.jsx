import Popup from "../popup/wrapper/Popup";
import { QrDisplayPayload } from "@polkadot/react-qr";
import { useState, useCallback, useEffect } from "react";
import { QrSigner } from "next-common/utils/qrSigner";
import { BN } from "@polkadot/util";
import { useUser } from "next-common/context/user";
import QrScannerComponent from "./scanner";

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
      const signedTx = await tx.signAsync(address, options);
      sendSignedTxWithEvents(api, signedTx, {
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
  const onScan = (res) => {
    if (res?.data) {
      onSignature({
        signature: `0x${res.data}`,
      });
    }
  };

  return (
    <div className=" space-y-4">
      <p className="text14Bold pb-1">
        1. Scan the QR code to sign in Polkadot Vault.
      </p>

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
      <p className="text14Bold pb-1">
        2. Show the signed QR code for the app to scan
      </p>
      <div className="p-4 bg-neutral-100 rounded-md">
        <QrScannerComponent onScan={onScan} />
      </div>
    </div>
  );
}

async function sendSignedTxWithEvents(api, signedTx, callbacks = {}) {
  const { onStarted, onError, onSubmitted, onInBlock, onFinalized } = callbacks;

  try {
    onStarted?.();

    const txHash = await api.rpc.author.submitExtrinsic(signedTx);
    onSubmitted?.(txHash.toHex());

    const unsubNew = await api.rpc.chain.subscribeNewHeads(async (header) => {
      const bh = header.hash;
      const block = await api.rpc.chain.getBlock(bh);

      const found = block.block.extrinsics.find(
        (ex) => ex.hash.toHex() === txHash.toHex(),
      );

      if (found) {
        onInBlock?.(bh.toHex());
        unsubNew();
      }
    });

    const unsubFinalized = await api.rpc.chain.subscribeFinalizedHeads(
      async (header) => {
        const bh = header.hash;
        const block = await api.rpc.chain.getBlock(bh);
        const events = await api.query.system.events.at(bh);

        block.block.extrinsics.forEach((ex, index) => {
          if (ex.hash.toHex() === txHash.toHex()) {
            onFinalized?.({
              blockHash: bh.toHex(),
              extrinsicIndex: index,
              events,
            });
            unsubFinalized();
          }
        });
      },
    );
  } catch (err) {
    onError?.(err);
  }
}
