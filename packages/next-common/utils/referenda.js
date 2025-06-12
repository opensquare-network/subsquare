export function getOngoingReferendumStatus(ongoingReferendum) {
  if (ongoingReferendum.decisionDeposit.isNone) {
    return "preparing";
  } else if (ongoingReferendum.inQueue.isTrue) {
    return "queueing";
  } else if (ongoingReferendum.deciding.isSome) {
    const deciding = ongoingReferendum.deciding.unwrap();
    if (deciding.confirming.isSome) {
      return "confirming";
    } else {
      return "deciding";
    }
  }

  return "";
}

export function* eachOngoingReferenda(allReferenda) {
  for (const [key, referendum] of allReferenda) {
    const unwrappedReferendum = referendum.unwrap();
    if (!unwrappedReferendum.isOngoing) {
      continue;
    }

    const ongoingReferendum = unwrappedReferendum.asOngoing;
    const referendumIndex = key.args[0].toNumber();
    yield [referendumIndex, ongoingReferendum];
  }
}

export class QueueingReferenda {
  constructor() {
    this.referendumIndexes = [];
    this.ayes = {};
  }

  addReferendum(referendumIndex, ongoingReferendum) {
    this.referendumIndexes.push(referendumIndex);

    // Keep track of ayes for queueing referenda
    const ayes = ongoingReferendum.tally.ayes.toBigInt();
    this.ayes[referendumIndex] = ayes;
  }

  toSortedReferendumIndexes() {
    // Sort queueing referenda by ayes, greater first
    return [...this.referendumIndexes].sort((a, b) => {
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
