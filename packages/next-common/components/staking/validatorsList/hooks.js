import { useAllValidators } from "next-common/hooks/staking/useAllValidators";
import { useActiveValidators } from "next-common/hooks/staking/useActiveValidators";
import { useMemo } from "react";
import { keyBy } from "lodash-es";
import { useChainSettings } from "next-common/context/chain";
import { useAsync } from "react-use";
import { fetchIdentity } from "next-common/services/identity";
import { getIdentityDisplay } from "next-common/utils/identity";

export function useValidators() {
  const { validators: allValidators, loading: isAllValidatorsLoading } =
    useAllValidators();
  const { validators: activeValidators, loading: isActiveValidatorsLoading } =
    useActiveValidators();
  const validators = useMemo(() => {
    if (!allValidators || !activeValidators) {
      return null;
    }
    const activeValidatorsMap = keyBy(activeValidators, "account");
    return allValidators.map((validator) => ({
      ...validator,
      isActive: !!activeValidatorsMap[validator.account],
      ...(activeValidatorsMap[validator.account] || {}),
    }));
  }, [allValidators, activeValidators]);
  return {
    validators,
    loading: isAllValidatorsLoading || isActiveValidatorsLoading,
  };
}

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
