import React from "react";
import {
  multiAssetBountyBaseUrl,
  multiAssetChildBountyBaseUrl,
} from "../../../../utils/postBaseUrl";
import CuratorItem from "./infoItem/curatorItem";
import DescriptionItem from "./infoItem/descriptionItem";
import IndexItem from "./infoItem/indexItem";
import TitleItem from "./infoItem/titleItem";

export default function MultiAssetChildBountyCuratorContent({
  bountyIndex,
  data,
}) {
  return (
    <>
      <TitleItem title={data?.postTitle} />
      <IndexItem
        index={data?.childBountyIndex}
        hrefIndex={bountyIndex}
        baseUrl={multiAssetChildBountyBaseUrl}
      />
      <IndexItem
        index={data?.parentBountyIndex}
        itemName="Parent bounty index"
        baseUrl={multiAssetBountyBaseUrl}
      />
      <CuratorItem curator={data?.curator} />
      <DescriptionItem description={data?.description} />
    </>
  );
}
