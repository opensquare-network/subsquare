import styled from "styled-components";
import Link from "next/link";
import Flex from "next-common/components/styled/flex";
import TriangleRight from "public/imgs/icons/arrow-triangle-right.svg";
import { getMotionId, shortMotionId } from "next-common/utils/motion";
import { detailPageCategory } from "next-common/utils/consts/business/category";

const ReferendaWrapper = styled(Flex)`
  justify-content: center;
  flex-wrap: wrap;
  padding: 12px;
  background: ${(props) => props.theme.grey100Bg};
  border-radius: 4px;
  margin-bottom: 16px;
  font-weight: 500;
  color: ${(props) => props.theme.textSecondary};

  > div {
    display: flex;
    align-items: center;
  }

  > div > svg {
    margin-right: 8px;
    fill: ${(props) => props.theme.textTertiary};
  }

  a {
    color: ${(props) => props.theme.secondarySapphire500};
  }

  > :not(:first-child) {
    margin-left: 8px;
  }
`;

export default function DemocracyNavigate({ motion, type }) {
  const chain = process.env.NEXT_PUBLIC_CHAIN;
  if (motion?.externalProposals?.length !== 1 && motion?.operateExternals?.length !== 1) {
    return null;
  }

  const external = motion.externalProposals?.[0] || motion.operateExternals?.[0];
  const councilMotion = external.motions?.[0];
  const techCommMotion = external.techCommMotions?.[0];
  const externalCouncilMotion = external.councilMotions?.[0];
  const referendumIndex = external.referendumIndex;

  return (
    <ReferendaWrapper>
      <div>
        {type !== detailPageCategory.COUNCIL_MOTION || motion.hash !== councilMotion.hash ? (
          <Link href={`/council/motion/${getMotionId(councilMotion)}`}>
            {`Motion #${shortMotionId(councilMotion)}`}
          </Link>
        ) : (
          `Motion #${shortMotionId(councilMotion)}`
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
      {techCommMotion ? (
        <div>
          <TriangleRight />
          {type !== detailPageCategory.TECH_COMM_MOTION ? (
            <Link
              href={`/techcomm/proposal/${getMotionId(techCommMotion, chain)}`}
            >
              {`Tech. Comm. #${shortMotionId(techCommMotion)}`}
            </Link>
          ) : (
            `Tech. Comm. #${shortMotionId(techCommMotion)}`
          )}
        </div>
      ) : (
        externalCouncilMotion && (
          <div>
            <TriangleRight />
            {type !== detailPageCategory.COUNCIL_MOTION || motion.hash !== externalCouncilMotion.hash ? (
              <Link href={`/council/motion/${getMotionId(externalCouncilMotion)}`}>
                {`Motion #${shortMotionId(externalCouncilMotion)}`}
              </Link>
            ) : (
              `Motion #${shortMotionId(externalCouncilMotion)}`
            )}
          </div>
        )
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
