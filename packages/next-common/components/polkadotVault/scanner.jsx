import { noop } from "lodash-es";
import { useEffect, useRef, useCallback } from "react";
import QrScanner from "qr-scanner";

export default function QrScannerComponent({ onError = noop, onScan = noop }) {
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);
  const streamRef = useRef(null);

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

  const startScan = useCallback(async () => {
    try {
      onError("");
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
      const qrScanner = new QrScanner(videoRef.current, onScan, {
        highlightScanRegion: true,
        highlightCodeOutline: true,
        maxScansPerSecond: 5,
        returnDetailedScanResult: true,
      });
      qrScannerRef.current = qrScanner;
      await qrScanner.start();
    } catch (err) {
      onError(
        err.name === "NotAllowedError"
          ? "Camera permission denied"
          : "Failed to start scanner: " + err.message,
      );
      cleanupResources();
    }
  }, [cleanupResources, onError, onScan]);

  useEffect(() => {
    startScan();
    return () => {
      cleanupResources();
    };
  }, [cleanupResources, startScan]);

  return (
    <div className="relative mx-auto w-[200px] h-[200px] bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        className="w-full h-full object-cover bg-textSecondary -scale-x-100"
        muted
        playsInline
        autoPlay
      />
      <div className="absolute inset-0 border-2 border-green-400 border-dashed rounded-lg m-4 animate-pulse"></div>
    </div>
  );
}
