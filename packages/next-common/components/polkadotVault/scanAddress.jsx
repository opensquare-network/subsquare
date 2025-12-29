import { useState, useCallback } from "react";
import Popup from "next-common/components/popup/wrapper/Popup";
import PrimaryButton from "next-common/lib/button/primary";
import SecondaryButton from "next-common/lib/button/secondary";
import { usePolkadotVaultAccounts } from "next-common/context/polkadotVault";
import { useChain } from "next-common/context/chain";
import WalletTypes from "next-common/utils/consts/walletTypes";
import { QrScanAddress } from "@polkadot/react-qr";
import { decodeAddress } from "@polkadot/util-crypto";
import { addressEllipsis } from "next-common/utils";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import { colorStyle, PromptTypes } from "next-common/components/scrollPrompt";
import { normalizeAddress } from "next-common/utils/address";

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

        const normalizedAddress = normalizeAddress(address);

        const publicKey = Buffer.from(
          decodeAddress(normalizedAddress),
        ).toString("hex");

        const accountName =
          name || "Vault:" + addressEllipsis(normalizedAddress, 4, 4);

        const raw = genesisHash
          ? `substrate:${normalizedAddress}:${genesisHash}${
              name ? `:${name}` : ""
            }`
          : `substrate:${normalizedAddress}`;

        addAccount(normalizedAddress, {
          raw,
          address: normalizedAddress,
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
        setError("Error processing substrate address");
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
        <div className="rounded-xl border border-neutral300 overflow-hidden p-4 w-full flex items-center justify-center">
          <QrScanAddress
            onScan={onScanSuccess}
            onError={(err) => setError(err.message)}
            size={200}
          />
        </div>

        {error && (
          <GreyPanel
            className="text14Medium px-4 py-2.5 whitespace-normal max-w-full overflow-auto"
            style={colorStyle[PromptTypes.ERROR]}
          >
            {error}
          </GreyPanel>
        )}

        <SecondaryButton size="small" onClick={onClose} className="w-full">
          Cancel
        </SecondaryButton>
      </div>
    </Popup>
  );
}
