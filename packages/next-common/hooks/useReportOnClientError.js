import { reportClientError } from "next-common/services/reportClientError";
import { CHAIN, IS_PRODUCTION } from "next-common/utils/constants";
import { useEffect } from "react";

console.info("IS_PRODUCTION", IS_PRODUCTION);

export function useReportOnClientError() {
  useEffect(() => {
    if (typeof window !== "undefined" && IS_PRODUCTION) {
      window.onerror = (message, _source, _lineno, _colno, error) => {
        const errorData = {
          chain: CHAIN,
          url: window.location.href,
          source: "client-onerror",
          error: message,
          stack: error?.stack,
        };

        reportClientError(errorData);
      };
    }
  }, []);
}
