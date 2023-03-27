import React from "react";
import BaseLayout from "./baseLayout";
import Menu from "../menu";
import { getHomeMenu } from "../../utils/consts/menu";

export default function HomeLayout({
  children,
  seoInfo,
  tracks,
  fellowshipTracks,
}) {
  const { homeMenus } = getHomeMenu({ tracks, fellowshipTracks });

  return (
    <BaseLayout seoInfo={seoInfo} left={<Menu menu={homeMenus} />}>
      {children}
    </BaseLayout>
  );
}
