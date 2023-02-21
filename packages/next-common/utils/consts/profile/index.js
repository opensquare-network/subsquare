import getChainSettings from "../settings";
import commonCategories from "./categories/common";
import gov2Category from "./categories/gov2";

export function getProfileCategories(chain) {
  const settings = getChainSettings(chain);
  if (settings.hasGov2) {
    return [gov2Category, ...commonCategories];
  }

  return commonCategories;
}
