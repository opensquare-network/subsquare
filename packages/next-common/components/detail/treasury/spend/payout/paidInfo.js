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
  const { extracted: { beneficiary } = {} } = useOnchainData();
  const beneficiaryAddress = beneficiary?.address;
  const beneficiaryChain = beneficiary?.chain;

  const state = usePostState();

  if (["Paid", "Processed"].includes(state)) {
    if (!beneficiary) {
      return <ClaimInfoText>This spend has been paid.</ClaimInfoText>;
    } else {
      return (
        <ClaimInfoText>
          This spend has been paid.&nbsp;
          <BeneficiaryLink beneficiary={beneficiary} />
        </ClaimInfoText>
      );
    }
  }

  if (beneficiaryChain === "assethub" && beneficiaryAddress) {
    return <BeneficiaryLink beneficiary={beneficiaryAddress} />;
  }

  return null;
}
