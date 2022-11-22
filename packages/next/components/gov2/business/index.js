import { useOnchainData } from "next-common/context/post";
import Link from "next/link";
import MultiKVList from "next-common/components/listInfo/multiKVList";

/**
 * Related business component for gov2 referendum
 */
export default function ReferendaBusiness() {
  const onchain = useOnchainData();
  if (!onchain.proposal) {
    return null;
  }

  const { section, method, args = [] } = onchain.proposal;
  if ("treasury" !== section || !["approveProposal", "rejectProposal"].includes(method)) {
    return null;
  }

  const proposalId = args[0].value;
  const business = [
    [
      [
        "Link to",
        <Link
          key="proposal-link"
          href={ `/treasury/proposal/${ proposalId }` }
        >{ `Treasury Proposal #${ proposalId }` }</Link>,
      ],
    ]
  ];

  return <MultiKVList title="Business" data={business} />;
}
