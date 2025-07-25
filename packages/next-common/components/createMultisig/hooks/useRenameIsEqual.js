import { isEmpty } from "lodash-es";
import { useMultisigAccounts } from "next-common/components/multisigs/context/multisigAccountsContext";

export default function useRenameIsEqual(multisigAddress = "", name = "") {
  const { multisigs = [] } = useMultisigAccounts();

  const names = multisigs
    .filter((multisig) => multisig.multisigAddress !== multisigAddress)
    .map((multisig) => multisig.name?.trim()?.toUpperCase());
  if (isEmpty(names)) {
    return false;
  }

  return names.includes(name?.trim()?.toUpperCase());
}
