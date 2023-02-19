import { CouncilMotionNavigator, NavigationWrapper } from "./navigators";
import { usePostOnChainData } from "../../../context/post";
import { useDetailType } from "../../../context/page";
import { detailPageCategory } from "../../../utils/consts/business/category";
import React from "react";
import Link from "next/link";
import TriangleRight from "../../../assets/imgs/icons/arrow-triangle-right.svg";

function AnnouncementNavigator({ cid, height, isLink = true }) {
  let link = `Announcement ${ cid.slice(0, 4) }...`;
  if (isLink) {
    link = (
      <Link href={ `/alliance/announcement/${ cid }` }>
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

export default function AnnouncementNavigation() {
  const type = useDetailType();
  if (detailPageCategory.ALLIANCE_ANNOUNCEMENT !== type) {
    return null;
  }

  const chainData = usePostOnChainData();
  const { cid, height } = chainData;
  const { motion } = chainData;
  if (!motion) {
    return null;
  }

  return <NavigationWrapper>
    <CouncilMotionNavigator motion={ motion } hasTriangle={ false } />
    <AnnouncementNavigator cid={ cid } height={ height } isLink={false} />
  </NavigationWrapper>
}
