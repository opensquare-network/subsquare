import { useState, useEffect } from "react";
import { useCoreFellowshipPallet } from "next-common/context/collectives/collectives";
import { useContextApi } from "next-common/context/api";

export default function useCoreFellowshipParams() {
  const api = useContextApi();
  const corePallet = useCoreFellowshipPallet();
  const [params, setParams] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!api) {
      return;
    }

    api.query[corePallet].params().then((params) => {
      setParams(params.toJSON());
      setIsLoading(false);
    });
  }, [api, corePallet]);

  return { params, isLoading };
}
