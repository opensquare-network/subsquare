import { reportClientError } from "next-common/services/reportClientError";
import { CHAIN } from "next-common/utils/constants";
import { useEffect } from "react";

export function useReportOnClientError() {
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

        reportClientError(errorData);
      };
    }
  }, []);
}
