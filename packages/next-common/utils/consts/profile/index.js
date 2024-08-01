import { isCollectivesChain } from "../../chain";
import getChainSettings from "../settings";
import allianceCategory from "./categories/alliance";
import commonCategories from "./categories/common";
import gov2Category from "./categories/gov2";

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

  function filterExcludeChains(items) {
    return items?.filter?.((item) => {
      return !item?.excludeChains?.includes?.(chain);
    });
  }

  const includedCategories = filterExcludeChains(
    categories.map((category) => {
      if (category.children) {
        category.children = filterExcludeChains(category.children);
      }

      return category;
    }),
  );

  return includedCategories;
}
