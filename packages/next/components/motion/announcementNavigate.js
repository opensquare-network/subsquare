import { useDetailType } from "next-common/context/page";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import { usePostOnChainData } from "next-common/context/post";
import { NavigationWrapper } from "next-common/components/detail/navigation/navigators";
import React from "react";

function MotionNavigator({ index }) {
  return <div>
    { `Motion #${ index }` }
  </div>
}

export default function AnnouncementNavigate() {
  const type = useDetailType();
  if (detailPageCategory.ALLIANCE_MOTION !== type) {
    return null;
  }

  const chainData = usePostOnChainData();
  const { index, announcements = [] } = chainData;
  if (announcements.length <= 0) {
    return
  }

  return <NavigationWrapper>
    <MotionNavigator index={index}/>
  </NavigationWrapper>
}
