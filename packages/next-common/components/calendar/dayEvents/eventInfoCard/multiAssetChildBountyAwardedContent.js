import React from "react";
import {
  multiAssetBountyBaseUrl,
  multiAssetChildBountyBaseUrl,
} from "../../../../utils/postBaseUrl";
import BeneficiaryItem from "./infoItem/beneficiaryItem";
import DescriptionItem from "./infoItem/descriptionItem";
import IndexItem from "./infoItem/indexItem";
import TitleItem from "./infoItem/titleItem";
import MultiAssetValueItem from "./infoItem/multiAssetValueItem";

export default function MultiAssetChildBountyAwardedContent({
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
      <BeneficiaryItem beneficiary={data?.beneficiary} />
      <MultiAssetValueItem value={data?.value} assetKind={data?.assetKind} />
      <DescriptionItem description={data?.description} />
    </>
  );
}
