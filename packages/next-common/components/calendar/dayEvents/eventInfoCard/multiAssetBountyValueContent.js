import React from "react";
import { multiAssetBountyBaseUrl } from "../../../../utils/postBaseUrl";
import DescriptionItem from "./infoItem/descriptionItem";
import IndexItem from "./infoItem/indexItem";
import TitleItem from "./infoItem/titleItem";
import MultiAssetValueItem from "./infoItem/multiAssetValueItem";

export default function MultiAssetBountyValueContent({ bountyIndex, data }) {
  return (
    <>
      <TitleItem title={data?.postTitle} />
      <IndexItem index={bountyIndex} baseUrl={multiAssetBountyBaseUrl} />
      <MultiAssetValueItem value={data?.value} assetKind={data?.assetKind} />
      <DescriptionItem description={data?.description} />
    </>
  );
}
