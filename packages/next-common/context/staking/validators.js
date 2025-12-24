import { useContext, createContext, useMemo } from "react";
import { keyBy } from "lodash-es";
import { useAllValidators } from "next-common/hooks/staking/useAllValidators";
import { useActiveValidators } from "next-common/hooks/staking/useActiveValidators";

const ValidatorsContext = createContext();

export function ValidatorsProvider({ children }) {
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

  const loading = isAllValidatorsLoading || isActiveValidatorsLoading;

  return (
    <ValidatorsContext.Provider value={{ validators, loading }}>
      {children}
    </ValidatorsContext.Provider>
  );
}

export function useValidators() {
  return useContext(ValidatorsContext);
}
