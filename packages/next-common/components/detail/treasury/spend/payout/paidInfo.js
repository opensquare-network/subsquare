import { useOnchainData, usePostState } from "next-common/context/post";
import { getParachainIdByMeta } from "next-common/utils/treasury/spend/usdCheck";
import { ClaimInfoText } from "next-common/components/treasury/common/styled";
import ExternalLink from "next-common/components/externalLink";
import getSpendBeneficiaryFromMeta from "next-common/utils/treasury/spend/beneficiary";
import { useChain } from "next-common/context/chain";

function BeneficiaryLink({ beneficiary }) {
  let link = `https://assethub-polkadot.subscan.io/account/${beneficiary}`;
  return (<ExternalLink className="text12Medium text-sapphire500" href={link}>
    Check the beneficiary
  </ExternalLink>);
}

export default function PayHint() {
  const chain = useChain();
  const { meta } = useOnchainData();
  const parachain = getParachainIdByMeta(meta);
  const beneficiary = getSpendBeneficiaryFromMeta(meta, chain);
  const state = usePostState();

  if (["Paid", "Processed"].includes(state)) {
    if (!beneficiary) {
      return <ClaimInfoText>This spend has been paid.</ClaimInfoText>;
    } else {
      return <ClaimInfoText>This spend has been paid.&nbsp;<BeneficiaryLink
        beneficiary={beneficiary} /></ClaimInfoText>;
    }
  }

  if (parachain === 1000 && beneficiary) {
    return <BeneficiaryLink beneficiary={beneficiary} />
  }

  return null;
}
