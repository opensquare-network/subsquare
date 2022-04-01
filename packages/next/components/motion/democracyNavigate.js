import styled from "styled-components";
import Link from "next/link";
import Flex from "next-common/components/styled/flex";
import TriangleRight from "public/imgs/icons/arrow-triangle-right.svg";
import {
  TYPE_COUNCIL_MOTION,
  TYPE_TECH_COMM_MOTION,
} from "next-common/utils/viewConstants";

const ReferendaWrapper = styled(Flex)`
  justify-content: center;
  flex-wrap: wrap;
  padding: 12px;
  background: #f6f7fa;
  border-radius: 4px;
  margin-bottom: 16px;
  font-weight: 500;
  color: #506176;

  > div {
    display: flex;
    align-items: center;
  }

  > div > svg {
    margin-right: 8px;
    fill: #9da9bb;
  }

  a {
    color: #1f70c7;
  }

  > :not(:first-child) {
    margin-left: 8px;
  }
`;

function getTechCommId(motion) {
  return `${motion?.indexer?.blockHeight}_${motion?.hash}`;
}

function shortTechId(motion) {
  return motion.hash.slice(0, 6);
}

export default function DemocracyNavigate({ motion, type }) {
  if (motion?.externalProposals?.length !== 1) {
    return null;
  }

  const external = motion.externalProposals[0];
  const councilMotion = external.motions?.[0];
  const techCommMotion = external.techCommMotions?.[0];
  const referendumIndex = external.referendumIndex;

  return (
    <ReferendaWrapper>
      <div>
        {type !== TYPE_COUNCIL_MOTION ? (
          <Link href={`/council/motion/${getTechCommId(councilMotion)}`}>
            {`Motion #${shortTechId(councilMotion)}`}
          </Link>
        ) : (
          `Motion #${shortTechId(councilMotion)}`
        )}
      </div>
      <div>
        <TriangleRight />
        <Link
          passHref={true}
          href={`/democracy/external/${external.indexer.blockHeight}_${external.proposalHash}`}
        >
          <a>{`External #${external.proposalHash?.slice(0, 6)}`}</a>
        </Link>
      </div>
      {techCommMotion && (
        <div>
          <TriangleRight />
          {type !== TYPE_TECH_COMM_MOTION ? (
            <Link href={`/techcomm/proposal/${getTechCommId(techCommMotion)}`}>
              {`Tech. Comm. #${shortTechId(techCommMotion)}`}
            </Link>
          ) : (
            `Tech. Comm. #${shortTechId(techCommMotion)}`
          )}
        </div>
      )}
      {referendumIndex !== undefined && (
        <div>
          <TriangleRight />
          <Link href={`/democracy/referendum/${referendumIndex}`}>
            {`Referenda #${referendumIndex}`}
          </Link>
        </div>
      )}
    </ReferendaWrapper>
  );
}
