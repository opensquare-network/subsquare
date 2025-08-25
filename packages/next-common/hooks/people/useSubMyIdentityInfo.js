import { useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import {
  convertIdentity,
  InitIdentityInfo,
  useIdentityOf,
} from "next-common/hooks/identity/useIdentityOf";

function useSuperOfIdentityDisplayName(identity) {
  const address = useRealAddress();
  const api = useContextApi();
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

        const identityResult = await api.query.identity
          ?.identityOf(superOfResult.parentAddress)
          .then((parentResult) => {
            if (!parentResult?.isNone) {
              const result = convertIdentity(parentResult);
              return result?.info || InitIdentityInfo;
            }
          });
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

function useAddressIdentityInfo(address) {
  const api = useContextApi();
  return useIdentityOf(api, address);
}

export default function useSubMyIdentityInfo() {
  const address = useRealAddress();
  const { info, judgements, isLoading } = useAddressIdentityInfo(address);
  const { result: superResult } = useSuperOfIdentityDisplayName(info);

  return {
    isLoading,
    info,
    judgements,
    displayName: (info?.display || superResult) ?? null,
  };
}
