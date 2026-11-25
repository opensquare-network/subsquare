import { useOnchainData, usePostState } from "next-common/context/post";
import { ClaimInfoText } from "next-common/components/treasury/common/styled";
import ExternalLink from "next-common/components/externalLink";

function BeneficiaryLink({ beneficiary }) {
  let link = `https://assethub-polkadot.statescan.io/#/accounts/${beneficiary}`;
  return (
    <ExternalLink className="text12Medium" href={link}>
      Check the beneficiary
    </ExternalLink>
  );
}

export default function PayHint({ payout }) {
  const state = usePostState();
  const { extracted } = useOnchainData();
  const { address: beneficiaryAddress, chain: beneficiaryChain } =
    extracted?.beneficiary || {};

  // A `Paid` spend can still be on chain as `Attempted` or `Failed` (a failed
  // payment may even be queued again), so only a spend that is settled or gone
  // from storage is reported as paid.
  const isPaid =
    state === "Processed" ||
    (state === "Paid" && !payout.spendLoading && !payout.spendExists);

  if (isPaid) {
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
