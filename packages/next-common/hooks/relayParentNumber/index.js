import { createGlobalState } from "react-use";
import { useEffect } from "react";
import { useContextApi } from "next-common/context/api";

const useRelayParentNumberState = createGlobalState(null);

export function useRelayParentNumber() {
  const [relayParentNumber] = useRelayParentNumberState();
  return relayParentNumber;
}

export function useSubRelayParentNumber() {
  const api = useContextApi();
  const [, setRelayParentNumber] = useRelayParentNumberState();

  useEffect(() => {
    if (!api?.query?.parachainSystem?.validationData) {
      return;
    }

    let isMounted = true;
    let unsubscribe;

    api.query.parachainSystem
      .validationData((validationData) => {
        if (!isMounted || !validationData?.isSome) {
          return;
        }
        setRelayParentNumber(
          validationData.unwrap().relayParentNumber.toNumber(),
        );
      })
      .then((unsub) => {
        if (isMounted) {
          unsubscribe = unsub;
        } else {
          unsub();
        }
      });

    return () => {
      isMounted = false;
      unsubscribe?.();
    };
  }, [api, setRelayParentNumber]);
}
