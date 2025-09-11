import { useEffect, useState } from "react";
import getElectorate from "next-common/utils/democracy/electorate";
import { useConditionalContextApi } from "next-common/context/migration/conditionalApi";

export default function useMaybeFetchElectorate(referendumStatus) {
  const api = useConditionalContextApi();
  const [electorate, setElectorate] = useState(0);

  const possibleElectorate = referendumStatus?.tally?.electorate;

  useEffect(() => {
    if (possibleElectorate) {
      setElectorate(possibleElectorate);
      return;
    }

    if (api) {
      getElectorate(api).then((electorate) => setElectorate(electorate));
    }
  }, [api, possibleElectorate]);

  return electorate;
}
