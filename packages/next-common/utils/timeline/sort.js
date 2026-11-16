export default function sortTimeline(timelineItems = []) {
  return timelineItems.sort((a, b) => {
    if (Array.isArray(a)) {
      a = a[0];
    }
    if (Array.isArray(b)) {
      b = b[0];
    }

    const blockTimeDiff = a.indexer.blockTime - b.indexer.blockTime;
    if (blockTimeDiff !== 0) {
      return blockTimeDiff;
    }

    const blockHeightA = a.indexer.blockHeight;
    const blockHeightB = b.indexer.blockHeight;
    if (
      blockHeightA != null &&
      blockHeightB != null &&
      blockHeightA !== blockHeightB
    ) {
      return blockHeightA - blockHeightB;
    }

    if (blockHeightA === blockHeightB) {
      const eventIndexA = a.indexer.eventIndex;
      const eventIndexB = b.indexer.eventIndex;
      if (eventIndexA != null && eventIndexB != null) {
        return eventIndexA - eventIndexB;
      }
    }

    return 0;
  });
}
