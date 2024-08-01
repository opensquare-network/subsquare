export function* eachOngoingReferenda(allReferenda) {
  for (const [key, referenda] of allReferenda) {
    const unwrappedReferenda = referenda.unwrap();
    if (!unwrappedReferenda.isOngoing) {
      continue;
    }

    const ongoingReferenda = unwrappedReferenda.asOngoing;
    const referendumIndex = key.args[0].toNumber();
    yield [referendumIndex, ongoingReferenda];
  }
}

export class QueueingReferenda {
  constructor() {
    this.referendumIndexes = [];
    this.ayes = {};
  }

  addReferendum(referendumIndex, ongoingReferenda) {
    this.referendumIndexes.push(referendumIndex);

    // Keep track of ayes for queueing referenda
    const ayes = ongoingReferenda.tally.ayes.toBigInt();
    this.ayes[referendumIndex] = ayes;
  }

  toSortedReferendumIndexes() {
    // Sort queueing referenda by ayes, greater first
    return this.referendumIndexes.toSorted((a, b) => {
      const ayesA = this.ayes[a];
      const ayesB = this.ayes[b];
      const delta = ayesB - ayesA;

      if (delta < 0) {
        return -1;
      } else if (delta > 0) {
        return 1;
      } else {
        return 0;
      }
    });
  }
}
