import { useChainSettings } from "next-common/context/chain";
import { useMemo } from "react";
import {
  Democracy,
  Referenda,
} from "next-common/components/profile/votingHistory/common";

export default function useDelegationModuleTabs() {
  const { modules: { referenda: hasReferenda, democracy } = {} } =
    useChainSettings();

  const hasDemocracy = democracy && !democracy?.archived;

  const moduleTabs = useMemo(() => {
    const tabs = [];
    if (hasReferenda) {
      tabs.push({ tabId: Referenda, tabTitle: Referenda });
    }

    if (hasDemocracy) {
      tabs.push({ tabId: Democracy, tabTitle: Democracy });
    }

    return tabs;
  }, [hasReferenda, hasDemocracy]);

  const defaultModuleTab = useMemo(() => {
    if (hasReferenda) {
      return Referenda;
    } else if (hasDemocracy) {
      return Democracy;
    }

    throw new Error("No either referenda or democracy in delegation page");
  }, [hasReferenda, hasDemocracy]);

  return {
    moduleTabs,
    defaultModuleTab,
  };
}
