import { isEmpty } from "lodash-es";
import { useMultisigAccounts } from "next-common/components/multisigs/context/accountsContext";

export default function useNameIsEqual(name = "") {
  const { multisigs = [] } = useMultisigAccounts();

  const names = multisigs.map((multisig) =>
    multisig.name?.trim()?.toUpperCase(),
  );
  if (isEmpty(names)) {
    return false;
  }

  return names.includes(name?.trim()?.toUpperCase());
}
