import markdownToText from "./markdownToText";

export const ItemType = {
  CATEGORY: "category",
  ITEM: "item",
};

export const formatItems = (
  proposalType,
  items,
  indexKeyOrGetIndexFn,
  displayIndexKeyOrGetIndexFn,
  noDisplayIndex = false,
  includeRaw = false,
) => {
  if (!items || (items || []).length <= 0) {
    return [];
  }

  return [
    {
      index: null,
      title: proposalType,
      content: "-",
      proposalType,
      type: ItemType.CATEGORY,
    },
    ...items.map((item) => {
      const index =
        typeof indexKeyOrGetIndexFn === "string"
          ? item[indexKeyOrGetIndexFn]
          : indexKeyOrGetIndexFn(item);
      const displayIndex =
        typeof displayIndexKeyOrGetIndexFn === "string"
          ? item[displayIndexKeyOrGetIndexFn]
          : displayIndexKeyOrGetIndexFn?.(item);
      return {
        index: index ?? 0,
        displayIndex: displayIndex ?? 0,
        title: item.title ?? "-",
        content: item.content
          ? item.content
          : item.contentSummary?.summary
          ? markdownToText(item.contentSummary.summary)
          : "-",
        highlight: item.highlight ?? null,
        proposalType,
        type: ItemType.ITEM,
        noDisplayIndex,
        raw: includeRaw ? item : null,
      };
    }),
  ];
};
