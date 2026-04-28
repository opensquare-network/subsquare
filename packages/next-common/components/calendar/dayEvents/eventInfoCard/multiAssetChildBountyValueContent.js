import React from "react";
import {
  multiAssetBountyBaseUrl,
  multiAssetChildBountyBaseUrl,
} from "../../../../utils/postBaseUrl";
import DescriptionItem from "./infoItem/descriptionItem";
import IndexItem from "./infoItem/indexItem";
import TitleItem from "./infoItem/titleItem";
import MultiAssetValueItem from "./infoItem/multiAssetValueItem";

export default function MultiAssetChildBountyValueContent({
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
      <MultiAssetValueItem value={data?.value} assetKind={data?.assetKind} />
      <DescriptionItem description={data?.description} />
    </>
  );
}
