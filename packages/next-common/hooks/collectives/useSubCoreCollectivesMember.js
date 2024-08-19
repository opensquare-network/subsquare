import { useContextApi } from "next-common/context/api";
import { useEffect, useState } from "react";

export default function useSubCoreCollectivesMember(
  address,
  pallet = "fellowshipCore",
) {
  const api = useContextApi();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address || !api?.query[pallet]?.member) {
      setLoading(false);
      return;
    }

    let unsub;
    api.query[pallet]
      .member(address, (rawOptional) => {
        if (rawOptional.isSome) {
          setMember(rawOptional.unwrap().toJSON());
        }
      })
      .then((result) => (unsub = result))
      .finally(() => setLoading(false));

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [address, api]);

  return { isLoading: loading, member };
}
