import { useChainSettings } from "next-common/context/chain";

export default function useInsideSearchSupportCategories() {
  const node = useChainSettings();
  const {
    referenda,
    democracy = {},
    treasury = {},
    fellowship = {},
  } = node?.modules ?? {};

  const categories = [
    ...(fellowship?.core ? ["fellowship members", "referenda", "spends"] : []),
    ...(referenda || democracy?.referenda ? ["referenda"] : []),
    ...(treasury?.bounties || treasury?.childBounties ? ["bounties"] : []),
    ...(node?.graphql?.identity ? ["identity"] : []),
    ...(treasury?.proposals ? ["treasury proposals"] : []),
    ...(treasury?.spends ? ["treasury spends"] : []),
  ];

  let categoryString = "";

  if (categories.length > 3) {
    categoryString = `${categories.slice(0, 3).join(", ")}, etc.`;
    if (fellowship?.core) {
      const rest = categories.slice(0, -1);
      const last = categories[categories.length - 1];
      categoryString = `${rest.join(", ")} and ${last}`;
    }
  } else {
    categoryString = categories.join(", ");
  }

  return {
    categories,
    categoryString,
  };
}
