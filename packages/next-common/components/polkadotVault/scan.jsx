import { useState, useCallback } from "react";
import Popup from "next-common/components/popup/wrapper/Popup";
import PrimaryButton from "next-common/lib/button/primary";
import SecondaryButton from "next-common/lib/button/secondary";
import { usePolkadotVaultAccounts } from "next-common/context/polkadotVault";
import { useChain } from "next-common/context/chain";
import WalletTypes from "next-common/utils/consts/walletTypes";
import QrScannerComponent from "./scanner";

export default function Scan({ onClose }) {
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
    (result) => {
      const str = result.data;
      if (!str || typeof str !== "string") {
        setError("Invalid QR code data");
        return;
      }

      if (str.startsWith("substrate:")) {
        try {
          const parts = str.split(":");
          if (parts.length < 3) {
            setError("Invalid substrate QR code format");
            return;
          }

          const [, address, pubkey] = parts;
          if (!address || !pubkey) {
            setError("Missing address or public key in QR code");
            return;
          }

          const name =
            "Vault:" + address.slice(0, 4) + "..." + address.slice(-4);

          addAccount(address, {
            raw: str,
            address,
            publicKey: pubkey,
            name: name,
            source: WalletTypes.POLKADOT_VAULT,
            meta: {
              name,
              source: WalletTypes.POLKADOT_VAULT,
            },
          });
          onClose();
        } catch (err) {
          setError("Error processing substrate QR code: " + err.message);
        }
      } else {
        setError("QR code must be a substrate address format");
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
        <QrScannerComponent onScan={onScanSuccess} onError={() => {}} />
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
