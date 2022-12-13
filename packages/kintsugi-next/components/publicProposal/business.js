/* eslint-disable react/jsx-key */
import isNil from "lodash.isnil";
import Link from "next/link";
import KvList from "next-common/components/listInfo/kvList";
import styled from "styled-components";

const LinkItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export default function Business({ treasuryProposals }) {
  const business = [];

  if (treasuryProposals?.length > 0) {
    business.push([
      "Link to",
      <LinkItems>
        {treasuryProposals.map((item) => (
          <Link
            href={`/treasury/proposal/${item.proposalIndex}`}
          >{`Treasury Proposal #${item.proposalIndex}`}</Link>
        ))}
      </LinkItems>,
    ]);
  }

  return business.length > 0 ? (
    <KvList title="Business" data={business} showFold />
  ) : null;
}
