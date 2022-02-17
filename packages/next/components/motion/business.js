import Link from "next/link";
import MultiKVList from "next-common/components/multiKVList";
import { isMotionCompleted } from "utils/viewfuncs";
import Flex from "next-common/components/styled/flex";
import User from "next-common/components/user";
import Links from "next-common/components/links";
import CapitalText from "../capitalText";
import { getNode, toPrecision } from "utils";

function createMotionBusinessData(motion) {
  const height = motion.state.indexer.blockHeight;
  return [
    [
      "Link to",
      <Link
        href={`/democracy/external/${height}_${motion.proposalHash}`}
      >{`External proposal ${motion.proposalHash.slice(0, 8)}`}</Link>,
    ],
  ];
}

export default function Business({ motion, chain }) {
  if (!motion) {
    return null;
  }

  const node = getNode(chain);
  if (!node) {
    return null;
  }
  const decimals = node.decimals;
  const symbol = node.symbol;

  const business = [];

  const motionCompleted = isMotionCompleted(motion);
  if (motionCompleted) {
    business.push(createMotionBusinessData(motion, chain));
  }

  if (
    motion.treasuryProposals?.length > 0 ||
    motion.treasuryBounties?.length > 0
  ) {
    for (const proposal of motion.treasuryProposals) {
      business.push([
        [
          "Link to",
          <Link
            href={`/treasury/proposal/${proposal.proposalIndex}`}
          >{`Treasury Proposal #${proposal.proposalIndex}`}</Link>,
        ],
        [
          "Beneficiary",
          <Flex>
            <User chain={chain} add={proposal.meta.beneficiary} fontSize={14} />
            <Links
              chain={chain}
              address={proposal.meta.beneficiary}
              style={{ marginLeft: 8 }}
            />
          </Flex>,
        ],
        [
          "Value",
          `${toPrecision(proposal.meta.value ?? 0, decimals)} ${symbol}`,
        ],
        ["Bond", `${toPrecision(proposal.meta.bond ?? 0, decimals)} ${symbol}`],
      ]);
    }

    for (const bounty of motion.treasuryBounties) {
      const kvData = [];

      kvData.push([
        "Link to",
        <Link
          href={`/treasury/bounty/${bounty.bountyIndex}`}
        >{`Treasury Bounty #${bounty.bountyIndex}`}</Link>,
      ]);

      const metadata = bounty.meta ? Object.entries(bounty.meta) : [];
      metadata.forEach((item) => {
        switch (item[0]) {
          case "proposer":
          case "beneficiary":
            kvData.push([
              <CapitalText>{item[0]}</CapitalText>,
              <Flex>
                <User chain={chain} add={item[1]} fontSize={14} />
                <Links
                  chain={chain}
                  address={item[1]}
                  style={{ marginLeft: 8 }}
                />
              </Flex>,
            ]);
            break;
          case "value":
          case "bond":
            kvData.push([
              <CapitalText>{item[0]}</CapitalText>,
              `${toPrecision(item[1] ?? 0, decimals)} ${symbol}`,
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
