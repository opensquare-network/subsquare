import { useContextApi } from "next-common/context/api";
import { useEffect, useState } from "react";

export default function useSubFellowshipCoreMember(address) {
  const api = useContextApi();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address || !api?.query?.fellowshipCore?.member) {
      setLoading(false);
      return;
    }

    let unsub;
    api.query.fellowshipCore
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
