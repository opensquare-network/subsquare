import { useState, useEffect, useMemo } from "react";
import { queryPeopleRegistrarsFromApi } from "next-common/services/gql/identity";
import { useContextApi } from "next-common/context/api";
import { useChainSettings } from "next-common/context/chain";

export default function useRegistrarsList() {
  const api = useContextApi();
  const [storageRegistrarsResult, setStorageRegistrarsResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chainRegistrars, setChainRegistrars] = useState([]);
  const { integrations } = useChainSettings();

  useEffect(() => {
    async function fetchStorageRegistrars() {
      setIsLoading(true);
      try {
        const res = await api?.query?.identity?.registrars();
        setStorageRegistrarsResult(res);
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
    }

    fetchStorageRegistrars();
  }, [api]);

  const storageRegistrars = useMemo(() => {
    if (!storageRegistrarsResult) {
      return [];
    }

    return (storageRegistrarsResult || [])
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
  }, [storageRegistrarsResult]);

  useEffect(() => {
    if (!integrations?.statescan) {
      return;
    }

    const fetchRegistrars = async () => {
      const { data } = await queryPeopleRegistrarsFromApi();
      setChainRegistrars(data);
    };
    fetchRegistrars();
  }, [integrations?.statescan]);

  const registrars = useMemo(() => {
    return storageRegistrars.map((item) => {
      const chainItem = chainRegistrars?.find(
        (chainItem) => chainItem.account === item.account,
      );
      return { ...item, ...chainItem };
    });
  }, [storageRegistrars, chainRegistrars]);

  return {
    registrars,
    isLoading,
    total: storageRegistrars?.length ?? 0,
  };
}
