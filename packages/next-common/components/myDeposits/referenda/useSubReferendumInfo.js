import { useEffect, useState } from "react";
import { useMountedState } from "react-use";
import { useConditionalContextApi } from "next-common/context/migration/conditionalApi";

export default function useSubReferendumInfo(pallet, referendumIndex) {
  const api = useConditionalContextApi();
  const isMounted = useMountedState();
  const [info, setInfo] = useState();

  useEffect(() => {
    if (!api?.query?.[pallet]) {
      return;
    }

    let unsub;
    api.query[pallet]
      .referendumInfoFor(referendumIndex, (optionalInfo) => {
        if (!isMounted() || !optionalInfo.isSome) {
          return;
        }

        setInfo(optionalInfo.unwrap().toJSON());
      })
      .then((result) => {
        unsub = result;
      });

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [api, isMounted, pallet, referendumIndex]);

  return info;
}
