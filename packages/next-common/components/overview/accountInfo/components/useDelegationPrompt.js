import { PromptTypes } from "next-common/components/scrollPrompt";
import { useChain, useChainSettings } from "next-common/context/chain";
import { isKintsugiChain } from "next-common/utils/chain";
import { CACHE_KEY } from "next-common/utils/constants";
import { useCookieValue } from "next-common/utils/hooks/useCookieValue";
import Link from "next/link";
import { useMemo } from "react";

export default function useDelegationPrompt() {
  const chain = useChain();
  const chainSettings = useChainSettings();
  const [visible, setVisible] = useCookieValue(
    CACHE_KEY.delegationPromptVisible,
    true,
  );

  const {
    modules: { referenda: hasReferenda, democracy: hasDemocracy },
  } = chainSettings;
  const hasDelegation =
    (hasReferenda || hasDemocracy) && !isKintsugiChain(chain);

  return useMemo(() => {
    if (!hasDelegation || !visible) {
      return {};
    }
    return {
      key: CACHE_KEY.delegationPromptVisible,
      message: (
        <div>
          No time to vote? Delegate your votes to an expert{" "}
          <Link className="underline" href={"/delegation"}>
            here
          </Link>
        </div>
      ),
      type: PromptTypes.INFO,
      close: () => setVisible(false, { expires: 15 }),
    };
  }, [setVisible, hasDelegation, visible]);
}
