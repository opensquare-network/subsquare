import { useState, useCallback } from "react";
import Popup from "next-common/components/popup/wrapper/Popup";
import PrimaryButton from "next-common/lib/button/primary";
import SecondaryButton from "next-common/lib/button/secondary";
import { usePolkadotVaultAccounts } from "next-common/context/polkadotVault";
import { useChain } from "next-common/context/chain";
import WalletTypes from "next-common/utils/consts/walletTypes";
import { QrScanAddress } from "@polkadot/react-qr";
import { decodeAddress } from "@polkadot/util-crypto";

export default function ScanAddress({ onClose }) {
  const [isScanning, setIsScanning] = useState(false);

  const stopScan = useCallback(() => {
    setIsScanning(false);
    onClose?.();
  }, [onClose]);

  const startScan = useCallback(async () => {
    setIsScanning(true);
  }, []);

  return (
    <>
      <div className="flex items-center justify-center py-1">
        <PrimaryButton
          className="mx-auto"
          size="small"
          onClick={startScan}
          disabled={isScanning}
        >
          Scan Add Address
        </PrimaryButton>
      </div>
      {isScanning && <ScanPopup onClose={stopScan} />}
    </>
  );
}

function ScanPopup({ onClose }) {
  const { addAccount } = usePolkadotVaultAccounts();
  const chain = useChain();
  const [error, setError] = useState("");

  const onScanSuccess = useCallback(
    (scanned) => {
      if (!scanned.isAddress) {
        setError("QR code must be a substrate address format");
        return;
      }

      try {
        const { content: address, genesisHash, name } = scanned;

        if (!address) {
          setError("Missing address in QR code");
          return;
        }

        const publicKey = Buffer.from(decodeAddress(address)).toString("hex");

        const accountName =
          name || "Vault:" + address.slice(0, 4) + "..." + address.slice(-4);

        const raw = genesisHash
          ? `substrate:${address}:${genesisHash}${name ? `:${name}` : ""}`
          : `substrate:${address}`;

        addAccount(address, {
          raw,
          address,
          publicKey,
          name: accountName,
          source: WalletTypes.POLKADOT_VAULT,
          meta: {
            name: accountName,
            source: WalletTypes.POLKADOT_VAULT,
            genesisHash,
          },
        });
        onClose();
      } catch (err) {
        setError("Error processing substrate QR code: " + err.message);
      }
    },
    [addAccount, onClose],
  );

  return (
    <Popup
      onClose={onClose}
      title={`Scan your ${chain} address QR`}
      showCloseIcon={false}
      className="w-[300px]"
    >
      <div className="space-y-3 flex flex-col items-center">
        <QrScanAddress
          onScan={onScanSuccess}
          onError={(err) => setError(err.message)}
          size={200}
        />
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-sm text-red-600">{error}</div>
          </div>
        )}

        <SecondaryButton size="small" onClick={onClose} className="w-[200px]">
          Cancel
        </SecondaryButton>
      </div>
    </Popup>
  );
}
