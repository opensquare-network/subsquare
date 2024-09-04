import { useEffect, useState } from "react";
import { useMountedState } from "react-use";
import { useContextApi } from "next-common/context/api";

export default function useSubReferendumInfo(pallet, referendumIndex) {
  const api = useContextApi();
  const isMounted = useMountedState();
  const [info, setInfo] = useState();

  useEffect(() => {
    if (!api) {
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
