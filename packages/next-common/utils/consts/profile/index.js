import { isCollectivesChain } from "../../chain";
import getChainSettings from "../settings";
import commonCategories from "./categories/common";
import gov2Category from "./categories/gov2";
import allianceCategory from "./categories/alliance";

export function getProfileCategories(chain) {
  const categories = [];

  const settings = getChainSettings(chain);
  const {
    modules: { referenda: hasReferenda, fellowship: hasFellowship },
  } = settings;
  if (hasReferenda || hasFellowship) {
    categories.push(gov2Category);
  }

  categories.push(...commonCategories);

  if (isCollectivesChain(chain)) {
    categories.push(allianceCategory);
  }

  const includedCategories = categories.filter((c) => {
    return !c.excludeChains?.includes?.(chain);
  });

  return includedCategories;
}
