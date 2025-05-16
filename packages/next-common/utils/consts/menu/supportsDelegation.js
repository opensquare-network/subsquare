import { CHAIN } from "next-common/utils/constants";
import { isKintsugiChain } from "next-common/utils/chain";
import getChainSettings from "../settings";

export default function supportsDelegation() {
  const chainSettings = getChainSettings(CHAIN);
  const {
    modules: { referenda: hasReferenda, democracy },
  } = chainSettings;
  const hasDemocracy = democracy && !democracy?.archived;

  return (hasReferenda || hasDemocracy) && !isKintsugiChain(CHAIN);
}
