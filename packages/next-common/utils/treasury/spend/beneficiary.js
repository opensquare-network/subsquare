import { encodeAddressToChain } from "next-common/services/address";

function getSpendBeneficiaryFromMetaV3(v3 = {}, chain) {
  const { parents, interior } = v3;
  if (parents !== 0) {
    return null;
  }
  const accountPub = interior?.x1?.accountId32?.id;
  if (accountPub) {
    return encodeAddressToChain(accountPub, chain);
  }
  return null;
}

function getSpendBeneficiaryFromMetaV4(v4 = {}, chain) {
  const { parents, interior } = v4;
  if (parents !== 0) {
    return null;
  }
  const accountPub = interior?.x1?.[0]?.accountId32?.id;
  if (accountPub) {
    return encodeAddressToChain(accountPub, chain);
  }
  return null;
}

export default function getSpendBeneficiaryFromMeta(meta, chain) {
  const { v3, v4 } = meta?.beneficiary || {};
  if (v3) {
    return getSpendBeneficiaryFromMetaV3(v3, chain);
  } else if (v4) {
    return getSpendBeneficiaryFromMetaV4(v4, chain);
  } else if (typeof meta?.beneficiary === "string") {
    return meta?.beneficiary;
  }

  return null;
}
