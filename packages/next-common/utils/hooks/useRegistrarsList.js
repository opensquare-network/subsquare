import { useState, useEffect, useMemo } from "react";
import { queryPeopleRegistrarsFromApi } from "next-common/services/gql/identity";
import useRegistrars from "next-common/hooks/people/useRegistrars";

export default function useRegistrarsList() {
  const { registrars: storageRegistrars, isLoading } = useRegistrars();
  const [chainRegistrars, setChainRegistrars] = useState([]);

  useEffect(() => {
    const fetchRegistrars = async () => {
      const { data } = await queryPeopleRegistrarsFromApi();
      setChainRegistrars(data);
    };
    fetchRegistrars();
  }, []);

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
