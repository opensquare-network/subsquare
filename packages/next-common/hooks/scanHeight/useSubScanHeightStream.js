import { useEffect, useRef, useState } from "react";
import { sleep } from "next-common/utils";
import { isNil, noop } from "lodash-es";

export function useSubScanHeightStream({
  url,
  timeout,
  callback = noop,
  enabled = true,
}) {
  const [reconnect, setReconnect] = useState(0);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const controller = new AbortController();
    let reader = null;

    (async () => {
      try {
        const response = await fetch(
          new URL(url, process.env.NEXT_PUBLIC_BACKEND_API_END_POINT),
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const decoder = new TextDecoder();
        let buffer = "";
        reader = response.body?.getReader?.() ?? null;
        if (!reader) {
          throw new Error("Reader is null");
        }

        // eslint-disable-next-line no-constant-condition
        while (true) {
          if (controller.signal.aborted) {
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
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed) {
                continue;
              }
              const data = JSON.parse(trimmed);
              const possibleValue = data?.value;
              if (!isNil(possibleValue)) {
                callbackRef.current(possibleValue);
              }
            }
          } catch (e) {
            console.error("Error parsing scan height data:", e);
          }
        }
      } catch (e) {
        if (controller.signal.aborted || e?.name === "AbortError") {
          return;
        }

        console.error("Error fetching scan height:", e);
        await sleep(5000);
        if (controller.signal.aborted) {
          return;
        }
        setReconnect((prev) => prev + 1);
      } finally {
        try {
          await reader?.cancel?.();
        } catch {
          // ignore
        }
      }
    })();

    return () => {
      controller.abort();
      // reader.cancel() is async and may reject with AbortError; swallow it.
      reader?.cancel?.().catch(() => null);
    };
  }, [reconnect, url, timeout, enabled]);
}
