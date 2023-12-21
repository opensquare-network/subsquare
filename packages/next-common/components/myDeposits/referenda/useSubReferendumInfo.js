import { useEffect, useState } from "react";
import useApi from "next-common/utils/hooks/useApi";
import useIsMounted from "next-common/utils/hooks/useIsMounted";

export default function useSubReferendumInfo(pallet, referendumIndex) {
  const api = useApi();
  const isMounted = useIsMounted();
  const [info, setInfo] = useState();

  useEffect(() => {
    if (!api) {
      return;
    }

    let unsub;
    api.query[pallet].referendumInfoFor(referendumIndex, (optionalInfo) => {
      if (!isMounted.current || !optionalInfo.isSome) {
        return;
      }

      setInfo(optionalInfo.unwrap().toJSON());
    });

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [api, referendumIndex]);

  return info;
}
