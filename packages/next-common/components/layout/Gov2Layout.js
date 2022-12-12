import React from "react";
import Menu from "../menu";
import BaseLayout from "./baseLayout";
import {
  gov2MenuFoldablePrefix,
  resolveGov2TracksMenu,
} from "../../utils/consts/menu/gov2";

export default function Gov2Layout({
  children,
  seoInfo,
  tracks,
  fellowshipTracks,
}) {
  const menu = resolveGov2TracksMenu(tracks, fellowshipTracks);

  return (
    <BaseLayout
      seoInfo={seoInfo}
      left={<Menu menu={menu} foldablePrefix={gov2MenuFoldablePrefix} />}
    >
      {children}
    </BaseLayout>
  );
}
