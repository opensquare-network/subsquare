import { useState, useCallback } from "react";
import { useContextApi } from "next-common/context/api";
import { useDeepCompareEffect } from "react-use";
import { TypeRegistry, createType } from "@polkadot/types";

export default function useSetIdentityDeposit(identityInfo = {}) {
  const api = useContextApi();
  const [deposit, setDeposit] = useState("0");
  const [isLoading, setIsLoading] = useState(false);

  const calculateTotalDeposit = useCallback(
    (basicDeposit, byteDeposit, info) => {
      if (!basicDeposit || !byteDeposit) return "0";

      try {
        if (!info || typeof info !== "object") {
          return "0";
        }

        const registry = new TypeRegistry();
        const formattedInfo = {
          display: info.display ? { Raw: info.display } : { None: null },
          legal: info.legal ? { Raw: info.legal } : { None: null },
          web: info.web ? { Raw: info.web } : { None: null },
          email: info.email ? { Raw: info.email } : { None: null },
          twitter: info.twitter ? { Raw: info.twitter } : { None: null },
          matrix: info.matrix ? { Raw: info.matrix } : { None: null },
          discord: info.discord ? { Raw: info.discord } : { None: null },
          github: info.github ? { Raw: info.github } : { None: null },
        };

        const encoded = createType(
          registry,
          "IdentityInfo",
          formattedInfo,
        ).toU8a();
        const byteSize = encoded?.length;

        const totalDeposit =
          BigInt(basicDeposit) + BigInt(byteSize) * BigInt(byteDeposit);

        return totalDeposit.toString();
      } catch (e) {
        return "0";
      }
    },
    [],
  );

  const fetchDeposits = useCallback(async () => {
    if (!api || !api.consts.identity) {
      setDeposit("0");
      return;
    }

    setIsLoading(true);

    try {
      const basicDeposit = api.consts.identity.basicDeposit?.toString();
      const byteDeposit = api.consts.identity.byteDeposit?.toString();
      const totalDeposit = calculateTotalDeposit(
        basicDeposit,
        byteDeposit,
        identityInfo,
      );

      setDeposit(totalDeposit);
    } catch (e) {
      setDeposit("0");
    } finally {
      setIsLoading(false);
    }
  }, [api, calculateTotalDeposit, identityInfo]);

  useDeepCompareEffect(() => {
    fetchDeposits();
  }, [fetchDeposits]);

  return { deposit, isLoading };
}
