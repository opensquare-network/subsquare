import { useMemo } from "react";
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
    ?.filter((item) => item && typeof item.index === "string")
    ?.map((item) => {
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

export function useMergedJudgementsData(
  judgementsResult = {},
  registrarResult = {},
) {
  const { judgements, isLoading: isIdentityInfoLoading } = judgementsResult;
  const { registrars, isLoading: isRegistrarLoading } = registrarResult;
  const isLoading = isIdentityInfoLoading || isRegistrarLoading;

  const data = useMemo(() => {
    if (isLoading) {
      return null;
    }

    return matchArraysByIndex(judgements, registrars);
  }, [judgements, registrars, isLoading]);

  return {
    data,
    isLoading,
  };
}

export default function useJudgementsData() {
  const judgementsResult = useIdentityInfoContext();
  const registrarResult = useRegistrarContext();

  return useMergedJudgementsData(judgementsResult, registrarResult);
}
