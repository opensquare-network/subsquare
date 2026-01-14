import { useEffect, useState } from "react";
import { useIdentityApi } from "../useIdentityApi";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useIdentityOf } from "next-common/hooks/identity/useIdentityOf";
import { fetchIdentityOf } from "../identity/identityFetch";

function useSuperOfIdentityDisplayName(identity) {
  const address = useRealAddress();
  const api = useIdentityApi();
  const [subDisplay, setSubDisplay] = useState(null);

  useEffect(() => {
    if (!api || !identity || identity?.display || !address) {
      return;
    }

    async function fetchIdentityInfo() {
      try {
        const superOfResult = await api.query.identity
          ?.superOf(address)
          .then((superOf) => {
            if (superOf?.isSome) {
              const [parentAddress, subDisplay] =
                superOf.unwrap()?.toHuman() || [];
              return {
                subDisplay: subDisplay?.Raw,
                parentAddress,
              };
            }
          });

        if (superOfResult?.isNone || !superOfResult?.parentAddress) {
          return;
        }

        const identityResult = await fetchIdentityOf(
          api,
          superOfResult.parentAddress,
        ).then((res) => res.info);

        if (identityResult.display && superOfResult.subDisplay) {
          setSubDisplay(
            `${identityResult.display}/${superOfResult.subDisplay}`,
          );
        }
      } catch (error) {
        console.error(error);
      }
    }

    try {
      fetchIdentityInfo();
    } catch (error) {
      console.error(error);
    }
  }, [api, identity, address]);

  return {
    result: subDisplay,
    isLoading: false,
  };
}

export default function useSubMyIdentityInfo() {
  const api = useIdentityApi();
  const address = useRealAddress();
  const { info, judgements, isLoading } = useIdentityOf(api, address);
  const { result: superResult } = useSuperOfIdentityDisplayName(info);

  return {
    isLoading,
    info,
    judgements,
    displayName: (info?.display || superResult) ?? null,
  };
}
