import Link from "next/link";
import TriangleRight from "public/imgs/icons/arrow-triangle-right.svg";
import { getUniqueMotionId } from "next-common/utils/motion";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import MotionNavigationItem from "./motionNavigationItem";
import { useSelector } from "react-redux";
import { chainSelector } from "next-common/store/reducers/chainSlice";
import { NavigationWrapper } from "next-common/components/detail/navigation/navigators";

export default function DemocracyNavigate({ motion }) {
  const chain = useSelector(chainSelector);
  if (motion?.externalProposals?.length !== 1 && motion?.operateExternals?.length !== 1) {
    return null;
  }

  const motionId = getUniqueMotionId(motion, chain)
  const external = motion.externalProposals?.[0] || motion.operateExternals?.[0];

  const motions = external.motions || [];
  const motionElements = motions.map((item, index) => {
    return <div key={getUniqueMotionId(item, chain)}>
      {
        index <= 0 ? null : <TriangleRight />
      }
      <MotionNavigationItem
        motion={ item }
        type={ detailPageCategory.COUNCIL_MOTION }
        pageMotionId={ motionId }
        chain={ chain } />
    </div>
  });

  const externalTechCommMotions = external.techCommMotions || [];
  const externalTechCommMotionElements = externalTechCommMotions.map(item => {
    return <div key={ getUniqueMotionId(item, chain) }>
      <TriangleRight />
      <MotionNavigationItem
        motion={ item }
        type={ detailPageCategory.TECH_COMM_MOTION }
        pageMotionId={ motionId }
        chain={ chain } />
    </div>
  })

  const handleExternalCouncilMotions = external.councilMotions || [];
  const handleExternalMotionElements = handleExternalCouncilMotions.map((item) => {
    return <div key={ getUniqueMotionId(item, chain) }>
      <TriangleRight />
      <MotionNavigationItem
        motion={ item }
        type={ detailPageCategory.COUNCIL_MOTION }
        pageMotionId={ motionId }
        chain={ chain } />
    </div>
  });

  const referendumIndex = external.referendumIndex;

  return (
    <NavigationWrapper>
      { motionElements }
      <div>
        <TriangleRight />
        <Link
          passHref={true}
          href={`/democracy/external/${external.indexer.blockHeight}_${external.proposalHash}`}
        >
          <a>{`External #${external.proposalHash?.slice(0, 6)}`}</a>
        </Link>
      </div>

      { externalTechCommMotionElements.length > 0 ? externalTechCommMotionElements : null }
      { handleExternalMotionElements.length > 0 ? handleExternalMotionElements : null }
      {referendumIndex !== undefined && (
        <div>
          <TriangleRight />
          <Link href={`/democracy/referendum/${referendumIndex}`}>
            {`Referendum #${referendumIndex}`}
          </Link>
        </div>
      )}
    </NavigationWrapper>
  );
}
