import { useState, useEffect, useMemo } from "react";
import { queryPeopleIdentitiesRegistrars } from "next-common/services/gql/identity";
import useRegistrars from "next-common/hooks/people/useRegistrars";

export default function useRegistrarsList() {
  const { registrars: storgeRegistrars, isLoading } = useRegistrars();
  const [chainRegistrars, setChainRegistrars] = useState([]);

  useEffect(() => {
    const fetchRegistrars = async () => {
      const { data } = await queryPeopleIdentitiesRegistrars();
      setChainRegistrars(data);
    };
    fetchRegistrars();
  }, []);

  const registrars = useMemo(() => {
    return storgeRegistrars.map((item) => {
      const chainItem = chainRegistrars.find(
        (chainItem) => chainItem.account === item.account,
      );
      return { ...item, ...chainItem };
    });
  }, [storgeRegistrars, chainRegistrars]);

  return {
    registrars,
    isLoading,
    total: storgeRegistrars?.length ?? 0,
  };
}
