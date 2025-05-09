import { useChainSettings } from "next-common/context/chain";

export default function useInsideSearchSupportCategories() {
  const node = useChainSettings();
  const { referenda, democracy = {}, treasury = {} } = node?.modules ?? {};

  const categories = [
    ...(referenda || democracy?.referenda ? ["Referenda"] : []),
    ...(treasury?.bounties || treasury?.childBounties ? ["Bounties"] : []),
    ...(node?.graphql?.identity ? ["Identity"] : []),
    ...(treasury?.proposals ? ["Treasury Proposals"] : []),
    ...(treasury?.spends ? ["Treasury Spends"] : []),
  ];

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
