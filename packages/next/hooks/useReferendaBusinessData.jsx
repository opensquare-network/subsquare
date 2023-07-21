import getTreasurySpendBusiness from "components/gov2/business/treasurySpend";
import { useChainSettings } from "next-common/context/chain";
import { useOnchainData } from "next-common/context/post";
import Link from "next/link";

export default function useReferendaBusinessData() {
  const { decimals, symbol } = useChainSettings();
  const onchain = useOnchainData();

  if (!onchain.proposal) {
    return [];
  }

  const spendBusiness = getTreasurySpendBusiness(onchain, decimals, symbol);
  if (spendBusiness) {
    return spendBusiness;
  }

  const { section, method, args = [] } = onchain.proposal?.call ?? {};
  if (
    "treasury" !== section ||
    !["approveProposal", "rejectProposal"].includes(method)
  ) {
    return null;
  }

  const proposalId = args[0].value;
  return [
    [
      [
        "Link to",
        <Link
          key="proposal-link"
          href={`/treasury/proposal/${proposalId}`}
          legacyBehavior
        >{`Treasury Proposal #${proposalId}`}</Link>,
      ],
      ["Method", method],
    ],
  ];
}
