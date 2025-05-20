import { useEffect, useState } from "react";
import { useChainSettings } from "next-common/context/chain";
import { sleep } from "next-common/utils";
import { useSetScanHeight } from "next-common/hooks/scanHeight";

export function useSubScanHeight({ url, timeout, setScanHeight }) {
  const [reconnect, setReconnect] = useState(0);

  useEffect(() => {
    let aborted = false;

    fetch(new URL(url, process.env.NEXT_PUBLIC_BACKEND_API_END_POINT))
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const decoder = new TextDecoder();
        const reader = response.body.getReader();
        if (!reader) {
          throw new Error("Reader is null");
        }
        // eslint-disable-next-line no-constant-condition
        while (true) {
          if (aborted) {
            reader.cancel();
            break;
          }
          const { value, done } = await Promise.race([
            reader.read(),
            new Promise((_, reject) =>
              setTimeout(
                () => reject(new Error("Read scan height timeout")),
                timeout,
              ),
            ),
          ]);
          if (done) {
            throw new Error("Scan height stream closed");
          }
          try {
            const data = JSON.parse(decoder.decode(value));
            const scanHeight = data?.value;
            if (scanHeight) {
              setScanHeight(scanHeight);
            }
          } catch (e) {
            console.error("Error parsing scan height data:", e);
          }
        }
      })
      .catch(async (e) => {
        console.error("Error fetching scan height:", e);
        await sleep(5000);
        setReconnect((prev) => prev + 1);
      });

    return () => {
      aborted = true;
    };
  }, [reconnect, url, timeout, setScanHeight]);
}

export default function ScanStatusComponent({ children, scanHeight }) {
  const { blockTime } = useChainSettings();
  const setScanHeight = useSetScanHeight();

  const interval = parseInt(blockTime) || 12000;

  useSubScanHeight({
    url: `stream/scan-height?interval=${interval}`,
    timeout: 10 * interval,
    setScanHeight,
  });

  useEffect(() => {
    if (scanHeight) {
      setScanHeight(scanHeight);
    }
  }, [setScanHeight, scanHeight]);

  return children;
}
