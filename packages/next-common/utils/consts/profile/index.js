import getChainSettings from "../settings";
import commonCategories from "./categories/common";
import gov2Category from "./categories/gov2";

export const CATEGORIES = [...commonCategories];

export function getProfileCategories(chain) {
  const settings = getChainSettings(chain);
  if (settings.hasGov2) {
    CATEGORIES.unshift(gov2Category);
  }

  return CATEGORIES;
}
