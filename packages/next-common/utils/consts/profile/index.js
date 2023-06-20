import { isCollectivesChain } from "../../chain";
import getChainSettings from "../settings";
import commonCategories from "./categories/common";
import gov2Category from "./categories/gov2";
import allianceCategory from "./categories/alliance";

export function getProfileCategories(chain) {
  const categories = [...commonCategories];

  const settings = getChainSettings(chain);
  if (settings.hasReferenda || settings.hasFellowship) {
    categories.push(gov2Category);
  }

  if (isCollectivesChain(chain)) {
    categories.push(allianceCategory);
  }

  return categories;
}
