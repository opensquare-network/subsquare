import { useMemo } from "react";
import useSubStorage from "next-common/hooks/common/useSubStorage";

export default function useRegistrars() {
  const { result, loading: isLoading } = useSubStorage(
    "identity",
    "registrars",
    [],
  );

  const registrars = useMemo(() => {
    if (!result) {
      return [];
    }

    return (result || [])
      .map((registrar, index) => {
        if (registrar?.isNone) {
          return null;
        }

        const { account, fee, fields } = registrar.unwrap();

        return {
          index,
          account: account?.toJSON(),
          fee: fee?.toString(),
          fields: fields?.toString(),
        };
      })
      .filter((registrar) => registrar !== null);
  }, [result]);

  return { registrars, isLoading };
}
