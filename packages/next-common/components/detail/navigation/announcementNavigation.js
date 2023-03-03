import { NavigationWrapper } from "./navigators";
import { usePostOnChainData } from "../../../context/post";
import { useDetailType } from "../../../context/page";
import { detailPageCategory } from "../../../utils/consts/business/category";
import React from "react";
import Link from "next/link";
import TriangleRight from "../../../assets/imgs/icons/arrow-triangle-right.svg";
import { useChain } from "../../../context/chain";
import { getMotionId, shortMotionId } from "../../../utils/motion";

export function AnnouncementNavigator({ cid, height, isLink = true }) {
  let link = `Announcement ${ cid.slice(0, 4) }...`;
  if (isLink) {
    link = (
      <Link href={ `/alliance/announcement/${height}_${ cid }` }>
        { link }
      </Link>
    );
  }

  return (
    <div>
      <TriangleRight />
      { link }
    </div>
  );
}

export function AllianceMotionNavigator({ motion }) {
  const chain = useChain();

  return (
    <div>
      <Link href={`/alliance/motion/${getMotionId(motion, chain)}`}>
        {`Motion #${shortMotionId(motion)}`}
      </Link>
    </div>
  );
}

export default function AnnouncementNavigation() {
  const type = useDetailType();
  if (detailPageCategory.ALLIANCE_ANNOUNCEMENT !== type) {
    return null;
  }

  const chainData = usePostOnChainData();
  const { motion, cid, height } = chainData;
  if (!motion) {
    return null;
  }

  return <NavigationWrapper>
    <AllianceMotionNavigator motion={ motion } />
    <AnnouncementNavigator cid={ cid } height={ height } isLink={false} />
  </NavigationWrapper>;
}
