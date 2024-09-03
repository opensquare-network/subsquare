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
  let link = `Announcement ${cid.slice(0, 4)}...`;
  if (isLink) {
    link = (
      <Link href={`/alliance/announcements/${height}_${cid}`} legacyBehavior>
        {link}
      </Link>
    );
  }

  return (
    <div>
      <TriangleRight />
      {link}
    </div>
  );
}

export function AllianceMotionNavigator({ motion }) {
  const chain = useChain();

  return (
    <div>
      <Link
        href={`/alliance/motions/${getMotionId(motion, chain)}`}
        legacyBehavior
      >
        {`Motion #${shortMotionId(motion)}`}
      </Link>
    </div>
  );
}

export default function AnnouncementNavigation() {
  const type = useDetailType();
  const chainData = usePostOnChainData();

  if (detailPageCategory.ALLIANCE_ANNOUNCEMENT !== type) {
    return null;
  }

  const { motion, cid, height } = chainData;
  if (!motion) {
    return null;
  }

  return (
    <NavigationWrapper>
      <AllianceMotionNavigator motion={motion} />
      <AnnouncementNavigator cid={cid} height={height} isLink={false} />
    </NavigationWrapper>
  );
}
