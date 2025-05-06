import { useChainSettings } from "next-common/context/chain";

export default function useInsideSearchSupportCategories() {
  const { modules = {} } = useChainSettings() || {};
  const { referenda, democracy = {}, treasury = {} } = modules;

  const categories = [];

  if (referenda || democracy.referenda) {
    categories.push("Referenda");
  }

  if (treasury.bounties || treasury.childBounties) {
    categories.push("Bounties");
  }

  if (modules?.identity) {
    categories.push("Identity");
  }

  const categoryString =
    categories.length > 0
      ? categories.length > 3
        ? `${categories.slice(0, 3).join(", ")}, etc`
        : categories.join(", ")
      : "";

  return {
    categories,
    categoryString,
  };
}
