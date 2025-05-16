import { useDetailType } from "next-common/context/page";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import { usePostOnChainData } from "next-common/context/post";
import { NavigationWrapper } from "next-common/components/detail/navigation/navigators";
import React from "react";
import Link from "next/link";
import TriangleRight from "next-common/assets/imgs/icons/arrow-triangle-right.svg";

function MotionNavigator({ index }) {
  return <div>{`Motion #${index}`}</div>;
}

function AnnouncementNavigator({ cid, height }) {
  return (
    <div>
      <TriangleRight />
      <Link href={`/alliance/announcements/${height}_${cid}`}>
        {`Announcement ${cid.slice(0, 4)}...`}
      </Link>
    </div>
  );
}

export default function AnnouncementNavigate() {
  const chainData = usePostOnChainData();
  const type = useDetailType();
  if (detailPageCategory.ALLIANCE_MOTION !== type) {
    return null;
  }

  const { index, announcement: { cid, indexer } = {} } = chainData;
  if (!cid || !indexer) {
    return null;
  }

  return (
    <NavigationWrapper>
      <MotionNavigator index={index} />
      <AnnouncementNavigator cid={cid} height={indexer.blockHeight} />
    </NavigationWrapper>
  );
}
