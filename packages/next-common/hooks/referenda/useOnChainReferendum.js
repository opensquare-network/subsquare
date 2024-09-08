import { isValidIntegerIndex } from "next-common/utils/isValidIntegerIndex";
import { useContextApi } from "next-common/context/api";
import { useState, useEffect } from "react";

export default function useOnChainReferendum(referendumIndex) {
  const api = useContextApi();
  const [referendumInfo, setReferendumInfo] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setReferendumInfo(null);
    setIsLoading(true);
    setIsLoaded(false);

    if (!isValidIntegerIndex(referendumIndex)) {
      setIsLoading(false);
      return;
    }

    if (!api) {
      return;
    }

    let cancelled = false;

    api.query.referenda
      .referendumInfoFor(referendumIndex)
      .then((data) => {
        if (cancelled) {
          return;
        }
        if (data.isNone) {
          setReferendumInfo(null);
        } else {
          setReferendumInfo(data.unwrap());
        }
        setIsLoaded(true);
      })
      .finally(() => {
        if (cancelled) {
          return;
        }
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [api, referendumIndex]);

  return { referendumInfo, isLoading, isLoaded };
}
