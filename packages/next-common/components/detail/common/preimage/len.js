export function getLenFromRequestStatus(status) {
  if (status.isUnrequested) {
    return status.asUnrequested.len.toNumber();
  } else if (status.isRequested) {
    const requested = status.asRequested;
    if (requested.maybeLen.isSome) {
      return requested.maybeLen.unwrap().toNumber();
    }
  }

  return null;
}

export function getLenFromOldRequestStatus(status) {
  if (status.isUnrequested) {
    return status.asUnrequested.len.toNumber();
  } else if (status.isRequested) {
    const requested = status.asRequested;
    if (requested.len.isSome) {
      return requested.len.unwrap().toNumber();
    }
  }

  return null;
}
