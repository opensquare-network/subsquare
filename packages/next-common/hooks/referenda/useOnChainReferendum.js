import { isValidIntegerIndex } from "next-common/utils/isValidIntegerIndex";

const { useContextApi } = require("next-common/context/api");
const { useState, useEffect } = require("react");

export default function useOnChainReferendum(referendumIndex) {
  const api = useContextApi();
  const [referendumInfo, setReferendumInfo] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!api) {
      return;
    }

    setReferendumInfo(null);
    setIsLoading(true);
    setIsLoaded(false);

    if (!isValidIntegerIndex(referendumIndex)) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    api.query.referenda
      .referendumInfoFor(referendumIndex)
      .then((data) => {
        if (data.isNone) {
          setReferendumInfo(null);
        } else {
          setReferendumInfo(data.unwrap());
        }
        setIsLoaded(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [api, referendumIndex]);

  return { referendumInfo, isLoading, isLoaded };
}
