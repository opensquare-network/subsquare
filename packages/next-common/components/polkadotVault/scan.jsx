import { useEffect, useRef, useState, useCallback } from "react";
import Popup from "next-common/components/popup/wrapper/Popup";
import PrimaryButton from "next-common/lib/button/primary";
import SecondaryButton from "next-common/lib/button/secondary";
import QrScanner from "qr-scanner";
import { usePolkadotVaultAccounts } from "next-common/context/polkadotVault";
import { useChain } from "next-common/context/chain";

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
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);
  const streamRef = useRef(null);
  const chain = useChain();
  const [error, setError] = useState("");

  const cleanupResources = useCallback(() => {
    if (qrScannerRef.current) {
      try {
        qrScannerRef.current.stop();
        qrScannerRef.current.destroy();
      } catch (err) {
        console.warn("Error destroying QR scanner:", err);
      }
      qrScannerRef.current = null;
    }

    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach((track) => track.stop());
      } catch (err) {
        console.warn("Error stopping media stream:", err);
      }
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const stopScan = useCallback(() => {
    cleanupResources();
    onClose?.();
  }, [cleanupResources, onClose]);

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

          const success = addAccount(address, {
            raw: str,
            address,
            publicKey: pubkey,
            name: "Vault Account",
            source: "polkadot-vault",
          });

          if (success) {
            stopScan();
          } else {
            setError("Account already exists or failed to add");
          }
        } catch (err) {
          setError("Error processing substrate QR code: " + err.message);
        }
      } else {
        setError("QR code must be a substrate address format");
      }
    },
    [addAccount, stopScan],
  );

  const handleScanResult = useCallback(
    (result) => {
      if (!result?.data) {
        return;
      }

      try {
        let qrData;
        if (result.data.startsWith("substrate:")) {
          qrData = result.data;
        } else {
          try {
            const parsed = JSON.parse(result.data);
            if (parsed.substrate || parsed.address) {
              qrData = result.data;
            } else {
              setError("Invalid QR code format");
              return;
            }
          } catch {
            setError("QR code must be a substrate address or valid JSON");
            return;
          }
        }

        onScanSuccess({ ...result, data: qrData });
        stopScan();
      } catch (err) {
        setError("Error processing QR code: " + err.message);
      }
    },
    [onScanSuccess, stopScan],
  );

  const startScan = useCallback(async () => {
    try {
      setError("");
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera access not supported");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise((resolve) => {
          videoRef.current.onloadedmetadata = resolve;
        });
      }
      const qrScanner = new QrScanner(videoRef.current, handleScanResult, {
        highlightScanRegion: true,
        highlightCodeOutline: true,
        maxScansPerSecond: 5,
        returnDetailedScanResult: true,
      });
      qrScannerRef.current = qrScanner;
      await qrScanner.start();
    } catch (err) {
      setError(
        err.name === "NotAllowedError"
          ? "Camera permission denied"
          : "Failed to start scanner: " + err.message,
      );
      cleanupResources();
    }
  }, [cleanupResources, handleScanResult]);

  useEffect(() => {
    startScan();
    return () => {
      cleanupResources();
    };
  }, [cleanupResources, startScan]);

  const _onClose = () => {
    cleanupResources();
    onClose?.();
  };

  return (
    <Popup
      onClose={onClose}
      title={`Scan your ${chain} address QR`}
      showCloseIcon={false}
    >
      <div className="space-y-3">
        <div className="relative mx-auto w-[200px] h-[200px] bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            className="w-full h-full object-cover bg-textSecondary"
            muted
            playsInline
            autoPlay
          />
          <div className="absolute inset-0 border-2 border-green-400 border-dashed rounded-lg m-4 animate-pulse"></div>
        </div>

        <div className="text-center text12Medium text-textTertiary">
          {/* {``} */}
        </div>

        <SecondaryButton size="small" onClick={_onClose} className="w-full">
          Cancel
        </SecondaryButton>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-sm text-red-600">{error}</div>
          </div>
        )}
      </div>
    </Popup>
  );
}
