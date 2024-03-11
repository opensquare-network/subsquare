import React from "react";
import { isNil } from "lodash-es";
import BeneficiaryItem from "./infoItem/beneficiaryItem";
import FinderItem from "./infoItem/finderItem";
import { ItemWrapper } from "./infoItem/styled";
import TitleItem from "./infoItem/titleItem";

export default function TreasuryTipContent({ data }) {
  return (
    <>
      <TitleItem title={data?.postTitle} />
      <FinderItem finder={data.proposer} />
      <BeneficiaryItem beneficiary={data.beneficiary} />
      {!isNil(data.method) && (
        <ItemWrapper>
          <span>Method:</span>
          <span>{data.method}</span>
        </ItemWrapper>
      )}
      <ItemWrapper>
        <span>Threshold:</span>
        <span>{data.threshold}</span>
      </ItemWrapper>
    </>
  );
}
