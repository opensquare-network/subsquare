import React from "react";
import { multiAssetBountyBaseUrl } from "../../../../utils/postBaseUrl";
import BeneficiaryItem from "./infoItem/beneficiaryItem";
import DescriptionItem from "./infoItem/descriptionItem";
import IndexItem from "./infoItem/indexItem";
import TitleItem from "./infoItem/titleItem";
import MultiAssetValueItem from "./infoItem/multiAssetValueItem";

export default function MultiAssetBountyAwardedContent({ bountyIndex, data }) {
  return (
    <>
      <TitleItem title={data?.postTitle} />
      <IndexItem index={bountyIndex} baseUrl={multiAssetBountyBaseUrl} />
      <BeneficiaryItem beneficiary={data?.beneficiary} />
      <MultiAssetValueItem value={data?.value} assetKind={data?.assetKind} />
      <DescriptionItem description={data?.description} />
    </>
  );
}
