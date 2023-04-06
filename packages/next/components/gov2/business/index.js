import { useOnchainData } from "next-common/context/post";
import Link from "next/link";
import MultiKVList from "next-common/components/listInfo/multiKVList";
import getTreasurySpendBusiness from "./treasurySpend";
import { useChainSettings } from "next-common/context/chain";

/**
 * Related business component for gov2 referendum
 */
export default function ReferendaBusiness() {
  const { decimals, symbol } = useChainSettings();
  const onchain = useOnchainData();
  if (!onchain.proposal) {
    return null;
  }

  const spendBusiness = getTreasurySpendBusiness(
    onchain,
    onchain.proposal?.call,
    decimals,
    symbol
  );
  if (spendBusiness) {
    return <MultiKVList title="Business" data={spendBusiness} />;
  }

  const { section, method, args = [] } = onchain.proposal?.call ?? {};
  if (
    "treasury" !== section ||
    !["approveProposal", "rejectProposal"].includes(method)
  ) {
    return null;
  }

  const proposalId = args[0].value;
  const business = [
    [
      [
        "Link to",
        <Link
          key="proposal-link"
          href={`/treasury/proposal/${proposalId}`}
          legacyBehavior>{`Treasury Proposal #${proposalId}`}</Link>,
      ],
    ],
  ];

  return <MultiKVList title="Business" data={business} />;
}
