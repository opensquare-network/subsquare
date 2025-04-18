import { useState, useEffect } from "react";
import { useContextApi } from "next-common/context/api";

export default function useRegistrars() {
  const api = useContextApi();
  const [registrars, setRegistrars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!api || !api.query?.identity) {
      setRegistrars([]);
      return;
    }

    setIsLoading(true);

    api.query.identity
      ?.registrars()
      .then((registrarsData) => {
        const formattedRegistrars = (registrarsData || [])
          ?.map((registrar, index) => {
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

        setRegistrars(formattedRegistrars);
      })
      .catch((e) => {
        console.error("Failed to query or process registrars:", e);
        setRegistrars([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [api]);

  return { registrars, isLoading };
}
