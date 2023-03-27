import React from "react";
import BaseLayout from "./baseLayout";
import Menu from "../menu";
import { resolveHomeMenu } from "../../utils/consts/menu";

export default function HomeLayout({
  children,
  seoInfo,
  tracks,
  fellowshipTracks,
}) {
  const { homeMenus } = resolveHomeMenu({ tracks, fellowshipTracks });

  return (
    <BaseLayout seoInfo={seoInfo} left={<Menu menu={homeMenus} />}>
      {children}
    </BaseLayout>
  );
}
