export function getPreimageTicket(preimage) {
  return (
    preimage.requested?.maybeTicket ||
    preimage.unrequested?.ticket ||
    preimage.requested?.deposit ||
    preimage.unrequested?.deposit
  );
}

export function getPreimageLen(preimage) {
  return preimage.requested?.maybeLen || preimage.unrequested?.len;
}

export function getPreimageStatus(preimage) {
  return preimage.requested ? "Requested" : "Unrequested";
}
