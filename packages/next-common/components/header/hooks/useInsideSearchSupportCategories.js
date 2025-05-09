import { useChainSettings } from "next-common/context/chain";

export default function useInsideSearchSupportCategories() {
  const node = useChainSettings();
  const { referenda, democracy = {}, treasury = {} } = node?.modules ?? {};

  const categories = [
    ...(referenda || democracy?.referenda ? ["referenda"] : []),
    ...(treasury?.bounties || treasury?.childBounties ? ["bounties"] : []),
    ...(node?.graphql?.identity ? ["identity"] : []),
    ...(treasury?.proposals ? ["treasury proposals"] : []),
    ...(treasury?.spends ? ["treasury spends"] : []),
  ];

  const categoryString =
    categories.length > 0
      ? categories.length > 3
        ? `${categories.slice(0, 3).join(", ")}, etc.`
        : categories.join(", ")
      : "";

  return {
    categories,
    categoryString,
  };
}
