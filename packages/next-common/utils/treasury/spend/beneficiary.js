import { encodeAddressToChain } from "next-common/services/address";

export default function getSpendBeneficiaryFromMeta(meta, chain) {
  const { parents, interior } = meta?.beneficiary?.v3 || {};
  if (parents !== 0) {
    return null;
  }

  const accountPub = interior?.x1?.accountId32?.id;
  if (accountPub) {
    return encodeAddressToChain(accountPub, chain);
  }

  return null;
}
