import { useState, useCallback } from "react";
import { useContextApi } from "next-common/context/api";
import { useDeepCompareEffect } from "react-use";
import { TypeRegistry, createType } from "@polkadot/types";

export default function useSetIdentityDeposit(identityInfo = {}) {
  const api = useContextApi();
  const [deposit, setDeposit] = useState("0");
  const [isLoading, setIsLoading] = useState(false);

  const fields = [
    "display",
    "legal",
    "web",
    "email",
    "twitter",
    "matrix",
    "discord",
    "github",
  ];

  const calculateTotalDeposit = useCallback(
    (basicDeposit, byteDeposit, info) => {
      if (!basicDeposit || !byteDeposit) return "0";

      try {
        if (!info || typeof info !== "object") {
          return "0";
        }

        const registry = new TypeRegistry();

        const formattedInfo = fields.reduce((result, field) => {
          result[field] = info[field] ? { Raw: info[field] } : { None: null };
          return result;
        }, {});

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
