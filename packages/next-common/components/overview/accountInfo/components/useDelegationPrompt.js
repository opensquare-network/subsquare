import { useChain, useChainSettings } from "next-common/context/chain";
import { isKintsugiChain } from "next-common/utils/chain";
import Link from "next/link";

export default function useDelegationPrompt() {
  const chain = useChain();
  const chainSettings = useChainSettings();

  const {
    modules: { referenda: hasReferenda },
  } = chainSettings;
  const hasDelegation =
    (hasReferenda || !chainSettings.noDemocracy) && !isKintsugiChain(chain);

  if (!hasDelegation) {
    return null;
  }

  return (
    <div>
      No time to vote? Delegate your votes to an expert{" "}
      <Link className="underline" href={"/delegation"}>
        here
      </Link>
    </div>
  );
}
