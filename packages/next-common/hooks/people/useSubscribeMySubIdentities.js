import { useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

export default function useSubscribeMySubIdentities() {
  const address = useRealAddress();
  const api = useContextApi();
  const [subsDeposit, setSubsDeposit] = useState(null);
  const [subs, setSubs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!api || !address || !api.query.identity?.subsOf) {
      setSubsDeposit(null);
      setSubs([]);
      return;
    }

    setIsLoading(true);
    let unsub;
    api.query.identity
      .subsOf(address, async (subs) => {
        if (!subs || subs[1].length <= 0) {
          setSubsDeposit("0");
          setSubs([]);
          setIsLoading(false);
          return;
        }

        try {
          setSubsDeposit(subs[0].toString());
          const subAccounts = subs[1] || [];
          const supers = await api.query?.identity?.superOf?.multi(subAccounts);
          const normalizedSubs = subAccounts.map((sub, index) => {
            const superData = supers[index].unwrapOr([null, { none: null }]);
            return [
              sub.toJSON(),
              superData[1].isRaw ? superData[1].asRaw.toHuman() : null,
            ];
          });
          setSubs(normalizedSubs);
        } catch (e) {
          setSubs([]);
          setSubsDeposit("0");
        } finally {
          setIsLoading(false);
        }
      })
      .then((result) => (unsub = result))
      .catch((e) => {
        console.error(e);
        setSubs([]);
        setSubsDeposit(null);
        setIsLoading(false);
      });

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [api, address]);

  return {
    subsDeposit,
    subs,
    isLoading,
  };
}
