import { reportError } from "next-common/services/reportError";
import { CHAIN } from "next-common/utils/constants";
import { useEffect } from "react";

export function useReportOnError() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.onerror = (message, _source, _lineno, _colno, error) => {
        const errorData = {
          chain: CHAIN,
          url: window.location.href,
          source: "client-onerror",
          error: message,
          stack: error?.stack,
        };

        reportError(errorData);
      };
    }
  }, []);
}
