import { useChainSettings } from "next-common/context/chain";
import { useAsync } from "react-use";
import { fetchIdentity } from "next-common/services/identity";
import { getIdentityDisplay } from "next-common/utils/identity";

export function useValidatorsWithIdentity(validators) {
  const { identity: identityChain } = useChainSettings();
  return useAsync(async () => {
    if (!validators) {
      return null;
    }
    return await Promise.all(
      validators.map(async (validator) => {
        const identity = await fetchIdentity(identityChain, validator.account);
        const name = getIdentityDisplay(identity);
        return {
          ...validator,
          name,
        };
      }),
    );
  }, [identityChain, validators]);
}
