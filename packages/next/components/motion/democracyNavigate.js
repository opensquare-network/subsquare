import Link from "next/link";
import TriangleRight from "next-common/assets/imgs/icons/arrow-triangle-right.svg";
import { getUniqueMotionId } from "next-common/utils/motion";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import MotionNavigationItem from "./motionNavigationItem";
import { NavigationWrapper } from "next-common/components/detail/navigation/navigators";
import { useChain } from "next-common/context/chain";
import { DemocracyReferendaTreasurySpendNavigator } from "next-common/components/detail/navigation/ReferendumNavigation";

function MultiMotionNavigator({ motions = [], type, pageMotionId }) {
  const chain = useChain();

  return motions.map((item, index) => (
    <div key={getUniqueMotionId(item, chain)}>
      {index <= 0 ? null : <TriangleRight />}
      <MotionNavigationItem
        motion={item}
        type={type}
        pageMotionId={pageMotionId}
      />
    </div>
  ));
}

function ExternalProposalNavigator({ external }) {
  return (
    <div>
      <TriangleRight />
      <Link
        passHref={true}
        href={`/democracy/externals/${external.indexer.blockHeight}_${external.proposalHash}`}
      >
        {`External #${external.proposalHash?.slice(0, 6)}`}
      </Link>
    </div>
  );
}

function ExternalTechCommMotionNavigator({ external, pageMotionId }) {
  if (external.techCommMotions?.length > 0) {
    return (
      <>
        <TriangleRight />
        <MultiMotionNavigator
          motions={external.techCommMotions}
          type={detailPageCategory.TECH_COMM_MOTION}
          pageMotionId={pageMotionId}
        />
      </>
    );
  }
}

function ExternalCouncilMotionNavigator({ external, pageMotionId }) {
  if (external.councilMotions?.length > 0) {
    return (
      <>
        <TriangleRight />
        <MultiMotionNavigator
          motions={external.councilMotions}
          type={detailPageCategory.COUNCIL_MOTION}
          pageMotionId={pageMotionId}
        />
      </>
    );
  }
}

function DemocracyReferendumNavigator({ external }) {
  const referendumIndex = external.referendumIndex;
  if (referendumIndex === undefined) {
    return null;
  }
  return (
    <div>
      <TriangleRight />
      <Link href={`/democracy/referenda/${referendumIndex}`} legacyBehavior>
        {`Referendum #${referendumIndex}`}
      </Link>
    </div>
  );
}

export function ExternalTreasurySpendNavigator({ external }) {
  if (!external.referendum) {
    return null;
  }
  return (
    <DemocracyReferendaTreasurySpendNavigator
      treasuryProposals={external.referendum.treasuryProposals}
    />
  );
}

export default function DemocracyNavigate({ motion }) {
  const chain = useChain();
  if (
    motion?.externalProposals?.length !== 1 &&
    motion?.operateExternals?.length !== 1
  ) {
    return null;
  }

  const motionId = getUniqueMotionId(motion, chain);
  const external =
    motion.externalProposals?.[0] || motion.operateExternals?.[0];

  return (
    <NavigationWrapper>
      <MultiMotionNavigator
        motions={external.motions}
        type={detailPageCategory.COUNCIL_MOTION}
        pageMotionId={motionId}
      />
      <ExternalProposalNavigator external={external} />
      <ExternalTechCommMotionNavigator
        external={external}
        pageMotionId={motionId}
      />
      <ExternalCouncilMotionNavigator
        external={external}
        pageMotionId={motionId}
      />
      <DemocracyReferendumNavigator external={external} />
      <ExternalTreasurySpendNavigator external={external} />
    </NavigationWrapper>
  );
}
