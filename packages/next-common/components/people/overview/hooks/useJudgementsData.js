import { useState, useEffect } from "react";
import { useRegistrarContext } from "next-common/context/people/registrarContext";
import { useIdentityInfoContext } from "next-common/context/people/identityInfoContext";

function matchArraysByIndex(judgements, registrars) {
  const registrarMap = new Map();
  registrars.forEach((item) => {
    if (item && typeof item.index === "number") {
      registrarMap.set(item.index, item);
    }
  });

  return judgements
    .filter((item) => item && typeof item.index === "string")
    .map((item) => {
      const index = parseInt(item.index, 10);
      const registrar = registrarMap.get(index);

      if (isNaN(index) || !registrar) {
        return null;
      }

      return {
        index: registrar.index,
        account: registrar.account,
        fee: registrar.fee,
        fields: registrar.fields,
        status: item.status,
      };
    })
    .filter(Boolean);
}

export default function useJudgementsData() {
  const { judgements, isLoading: isIdentityInfoLoading } =
    useIdentityInfoContext();
  const { registrars, isLoading: isRegistrarLoading } = useRegistrarContext();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (isIdentityInfoLoading || isRegistrarLoading) {
      setIsLoading(true);
      return;
    }

    if (
      !Array.isArray(judgements) ||
      !Array.isArray(registrars) ||
      judgements?.length === 0 ||
      registrars?.length === 0
    ) {
      setIsLoading(false);
      setData(null);
      return;
    }

    const matchedJudgements = matchArraysByIndex(judgements, registrars);
    setData(matchedJudgements);
    setIsLoading(false);
  }, [isIdentityInfoLoading, isRegistrarLoading, judgements, registrars]);

  return {
    data,
    isLoading,
  };
}
