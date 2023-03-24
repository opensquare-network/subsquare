/* eslint-disable */

import React from "react";
import BaseLayout from "./baseLayout";
import Menu from "../menu";
import homeMenus from "../../utils/consts/menu";

export default function HomeLayout({
  children,
  seoInfo,
  tracks,
  fellowshipTracks,
}) {
  return (
    <BaseLayout seoInfo={seoInfo} left={<Menu menu={homeMenus} />}>
      {children}
    </BaseLayout>
  );
}
