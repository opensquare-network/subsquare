import normalizeCall from "next-common/components/democracy/metadata/normalize";

function parseCall(api, bytes) {
  const proposal = api.registry.createType("Proposal", bytes);
  return normalizeCall(proposal);
}

async function lookupPreimage(api, lookup) {
  const hash = lookup.hash_;
  const len = lookup.len;
  return await api.query.preimage.preimageFor([hash, len]);
}

async function getLegacyPreimage(api, legacy) {
  return await api.query.preimage.preimageFor(legacy.hash_);
}

export async function extractReferendumCall(api, referendum) {
  const proposal = referendum?.proposal;
  if (!proposal) {
    return;
  }

  if (proposal.isInline) {
    return parseCall(api, proposal.asInline);
  }

  if (proposal.isLegacy) {
    const preimage = await getLegacyPreimage(api, proposal.asLegacy);
    const bytes = preimage.unwrap();
    return parseCall(api, bytes);
  }

  if (proposal.isLookup) {
    const preimage = await lookupPreimage(api, proposal.asLookup);
    const bytes = preimage.unwrap();
    return parseCall(api, bytes);
  }
}
