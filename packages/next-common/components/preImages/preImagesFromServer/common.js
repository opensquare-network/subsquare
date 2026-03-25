export function getPreimageTicket(preimage) {
  return (
    preimage.requested?.maybeTicket ||
    preimage.unrequested?.ticket ||
    preimage.requested?.deposit ||
    preimage.unrequested?.deposit
  );
}

export function getPreimageLen(preimage) {
  const len =
    preimage.requested?.maybeLen ??
    preimage.unrequested?.len ??
    preimage.proposalLength;

  return typeof len?.toNumber === "function" ? len.toNumber() : len;
}

export function getPreimageStatus(preimage) {
  return preimage.requested ? "Requested" : "Unrequested";
}
