import Link from "next/link";
import MultiKVList from "next-common/components/listInfo/multiKVList";
import Flex from "next-common/components/styled/flex";
import User from "next-common/components/user";
import ExtrinsicLinks from "next-common/components/links";
import CapitalText from "../capitalText";
import SymbolBalance from "next-common/components/values/symbolBalance";

export default function Business({ motion }) {
  if (!motion) {
    return null;
  }

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
          >{`Treasury Proposal #${proposal.proposalIndex}`}</Link>,
        ],
        [
          "Beneficiary",
          <Flex key="proposal-beneficiary">
            <User add={proposal.meta.beneficiary} fontSize={14} />
            <ExtrinsicLinks
              address={proposal.meta.beneficiary}
              style={{ marginLeft: 8 }}
            />
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
        >{`Treasury Bounty #${bounty.bountyIndex}`}</Link>,
      ]);

      const metadata = bounty.meta ? Object.entries(bounty.meta) : [];
      metadata.forEach((item) => {
        switch (item[0]) {
          case "proposer":
          case "beneficiary":
            kvData.push([
              <CapitalText key="bounty-beneficiary-text">
                {item[0]}
              </CapitalText>,
              <Flex key="bounty-beneficiary-value">
                <User add={item[1]} fontSize={14} />
                <ExtrinsicLinks address={item[1]} style={{ marginLeft: 8 }} />
              </Flex>,
            ]);
            break;
          case "value":
          case "bond":
            kvData.push([
              <CapitalText key="bounty-bond-text">{item[0]}</CapitalText>,
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
            href={`/democracy/external/${external?.indexer?.blockHeight}_${external?.proposalHash}`}
          >{`Democracy External #${external?.proposalHash?.slice(
            0,
            6
          )}`}</Link>,
        ],
        ["hash", external.proposalHash],
        ["voteThreshould", external.voteThreshold],
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
            href={`/democracy/external/${external?.indexer?.blockHeight}_${external?.proposalHash}`}
          >{`Democracy External #${external?.proposalHash?.slice(
            0,
            6
          )}`}</Link>,
        ],
        ["hash", external.proposalHash],
        ["voteThreshould", external.voteThreshold],
      ]);
    });
  }

  return <MultiKVList title="Business" data={business} />;
}
