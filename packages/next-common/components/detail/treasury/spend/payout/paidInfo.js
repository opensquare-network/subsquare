import { useOnchainData, usePostState } from "next-common/context/post";
import { ClaimInfoText } from "next-common/components/treasury/common/styled";
import ExternalLink from "next-common/components/externalLink";

function BeneficiaryLink({ beneficiary }) {
  let link = `https://assethub-polkadot.subscan.io/account/${beneficiary}`;
  return (
    <ExternalLink className="text12Medium" href={link}>
      Check the beneficiary
    </ExternalLink>
  );
}

export default function PayHint() {
  const state = usePostState();
  const { extracted } = useOnchainData();
  const { address: beneficiaryAddress, chain: beneficiaryChain } =
    extracted?.beneficiary || {};

  if (["Paid", "Processed"].includes(state)) {
    if (!beneficiaryAddress) {
      return <ClaimInfoText>This spend has been paid.</ClaimInfoText>;
    } else {
      return (
        <ClaimInfoText>
          This spend has been paid.&nbsp;
          <BeneficiaryLink beneficiary={beneficiaryAddress} />
        </ClaimInfoText>
      );
    }
  }

  if (beneficiaryChain === "assethub" && beneficiaryAddress) {
    return <BeneficiaryLink beneficiary={beneficiaryAddress} />;
  }

  return null;
}
