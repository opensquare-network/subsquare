import React from "react";
import { multiAssetBountyBaseUrl } from "../../../../utils/postBaseUrl";
import CuratorItem from "./infoItem/curatorItem";
import DescriptionItem from "./infoItem/descriptionItem";
import IndexItem from "./infoItem/indexItem";
import TitleItem from "./infoItem/titleItem";

export default function MultiAssetBountyCuratorContent({ bountyIndex, data }) {
  return (
    <>
      <TitleItem title={data?.postTitle} />
      <IndexItem index={bountyIndex} baseUrl={multiAssetBountyBaseUrl} />
      <CuratorItem curator={data?.curator} />
      <DescriptionItem description={data?.description} />
    </>
  );
}
