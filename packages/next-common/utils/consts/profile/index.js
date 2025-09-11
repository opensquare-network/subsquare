import { isCollectivesChain } from "../../chain";
import getChainSettings from "../settings";
import { allianceCategory } from "./categories/alliance";
import { collectivesCategory } from "./categories/collectives";
import { democracyCategory } from "./categories/democracy";
import { discussionCategory } from "./categories/discussion";
import { gov2Fellowship, gov2Referenda } from "./categories/gov2";
import { treasuryCategory } from "./categories/treasury";

export function getProfileCategories(chain) {
  const categories = [];

  const settings = getChainSettings(chain);
  const {
    modules: {
      referenda: hasReferenda,
      fellowship: hasFellowship,
      treasury: hasTreasury,
      democracy: hasDemocracy,
    },
  } = settings;

  if (hasReferenda || hasFellowship) {
    categories.push({
      id: "openGov",
      name: "OpenGov",
      children: [
        hasReferenda && gov2Referenda,
        hasFellowship && gov2Fellowship,
      ].filter(Boolean),
    });
  }

  if (hasDemocracy) {
    categories.push(democracyCategory);
  }

  if (hasTreasury) {
    categories.push(treasuryCategory);
  }

  if (hasDemocracy) {
    categories.push(collectivesCategory);
  }

  if (isCollectivesChain(chain)) {
    categories.push(allianceCategory);
  }

  categories.push(discussionCategory);

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
