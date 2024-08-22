import { usePostOnChainData } from "next-common/context/post";
import Link from "next/link";
import Flex from "next-common/components/styled/flex";
import SymbolBalance from "next-common/components/values/symbolBalance";
import Copyable from "next-common/components/copyable";
import AddressUser from "next-common/components/user/addressUser";
import Proposal from "next-common/components/proposal";
import { useDetailType } from "next-common/context/page";
import { detailPageCategory } from "next-common/utils/consts/business/category";

function getTreasuryProposalLink(type, proposalIndex) {
  if (type === detailPageCategory.COMMUNITY_MOTION) {
    return `/community-treasury/proposals/${proposalIndex}`;
  }
  return `/treasury/proposals/${proposalIndex}`;
}

export function useCouncilMotionBusinessData() {
  const motion = usePostOnChainData();
  const type = useDetailType();

  const business = [];

  if (
    motion.treasuryProposals?.length > 0 ||
    motion.treasuryBounties?.length > 0
  ) {
    for (const proposal of motion.treasuryProposals) {
      business.push([
        [
          "Link to",
          <Link
            key="proposal-link"
            href={getTreasuryProposalLink(type, proposal.proposalIndex)}
            legacyBehavior
          >{`Treasury Proposal #${proposal.proposalIndex}`}</Link>,
        ],
        [
          "Beneficiary",
          <Flex key="proposal-beneficiary">
            <AddressUser add={proposal.meta?.beneficiary} />
          </Flex>,
        ],
        [
          "Value",
          <SymbolBalance key="proposal-value" value={proposal.meta?.value} />,
        ],
        [
          "Bond",
          <SymbolBalance key="proposal-bond" value={proposal.meta?.bond} />,
        ],
      ]);
    }

    for (const bounty of motion.treasuryBounties) {
      const kvData = [];

      kvData.push([
        "Link to",
        <Link
          key="bounty-link"
          href={`/treasury/bounties/${bounty.bountyIndex}`}
          legacyBehavior
        >{`Treasury Bounty #${bounty.bountyIndex}`}</Link>,
      ]);

      const metadata = bounty.meta ? Object.entries(bounty.meta) : [];
      metadata.forEach((item) => {
        switch (item[0]) {
          case "proposer":
          case "beneficiary":
            kvData.push([
              <span key="bounty-beneficiary-text" className="capitalize">
                {item[0]}
              </span>,
              <Flex key="bounty-beneficiary-value">
                <AddressUser add={item[1]} />
              </Flex>,
            ]);
            break;
          case "value":
          case "bond":
            kvData.push([
              <span key="bounty-bond-text" className="capitalize">
                {item[0]}
              </span>,
              <SymbolBalance key="bounty-bond-value" value={item[1]} />,
            ]);
            break;
        }
      });

      business.push(kvData);
    }
  }

  if (motion?.externalProposals?.length > 0) {
    motion?.externalProposals?.forEach((external) => {
      business.push([
        [
          "Link to",
          <Link
            key="external-link"
            href={`/democracy/externals/${external?.indexer?.blockHeight}_${external?.proposalHash}`}
            legacyBehavior
          >{`Democracy External #${external?.proposalHash?.slice(
            0,
            6,
          )}`}</Link>,
        ],
        ["Hash", <Copyable key="hash">{external.proposalHash}</Copyable>],
        ["Threshold", external.voteThreshold],
      ]);

      if (external.preImage) {
        business.push([
          [
            <Proposal
              key="call"
              call={external.preImage.call}
              preImageHash={external.preImage.hash}
            />,
          ],
        ]);
      }
    });
  }

  if (motion?.operateExternals?.length > 0) {
    motion?.operateExternals?.forEach((external) => {
      business.push([
        [
          "Link to",
          <Link
            key="external-link"
            href={`/democracy/externals/${external?.indexer?.blockHeight}_${external?.proposalHash}`}
            legacyBehavior
          >{`Democracy External #${external?.proposalHash?.slice(
            0,
            6,
          )}`}</Link>,
        ],
        ["Hash", <Copyable key="hash">{external.proposalHash}</Copyable>],
        ["Threshold", external.voteThreshold],
      ]);
    });
  }

  return business;
}
