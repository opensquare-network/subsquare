import { usePostOnChainData } from "next-common/context/post";
import Link from "next/link";
import Flex from "next-common/components/styled/flex";
import User from "next-common/components/user";
import SymbolBalance from "next-common/components/values/symbolBalance";
import Copyable from "next-common/components/copyable";

export function useCouncilMotionBusinessData() {
  const motion = usePostOnChainData();

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
            href={`/treasury/proposal/${proposal.proposalIndex}`}
            legacyBehavior
          >{`Treasury Proposal #${proposal.proposalIndex}`}</Link>,
        ],
        [
          "Beneficiary",
          <Flex key="proposal-beneficiary">
            <User add={proposal.meta.beneficiary} fontSize={14} />
          </Flex>,
        ],
        [
          "Value",
          <SymbolBalance key="proposal-value" value={proposal.meta.value} />,
        ],
        [
          "Bond",
          <SymbolBalance key="proposal-bond" value={proposal.meta.bond} />,
        ],
      ]);
    }

    for (const bounty of motion.treasuryBounties) {
      const kvData = [];

      kvData.push([
        "Link to",
        <Link
          key="bounty-link"
          href={`/treasury/bounty/${bounty.bountyIndex}`}
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
                <User add={item[1]} fontSize={14} />
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
