export default function getStatusColor(status) {
  switch (status.toLowerCase()) {
    case "preparing":
      return "#2196F3";
    case "queueing":
      return "#FF9800";
    case "deciding":
      return "#0F6FFF";
    case "confirming":
      return "#4CAF50";
    default:
      return "";
  }
}

export function groupReferenda(allReferenda) {
  const groups = {
    preparing: [],
    queueing: [],
    deciding: [],
    confirming: [],
  };

  allReferenda.forEach(([, referenda]) => {
    const unwrappedReferenda = referenda.unwrap();
    if (!unwrappedReferenda.isOngoing) {
      return;
    }

    const ongoingReferenda = unwrappedReferenda.asOngoing;
    if (ongoingReferenda.decisionDeposit.isNone) {
      groups.preparing.push(ongoingReferenda);
    } else if (ongoingReferenda.inQueue.isTrue) {
      groups.queueing.push(ongoingReferenda);
    } else if (ongoingReferenda.deciding.isSome) {
      const deciding = ongoingReferenda.deciding.unwrap();
      if (deciding.confirming.isSome) {
        groups.confirming.push(ongoingReferenda);
      } else {
        groups.deciding.push(ongoingReferenda);
      }
    }
  });

  return groups;
}
