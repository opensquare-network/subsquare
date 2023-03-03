import isNil from "lodash.isnil";
import BeneficiaryItem from "./infoItem/beneficiaryItem";
import FinderItem from "./infoItem/finderItem";
import { ItemWrapper } from "./infoItem/styled";

export default function TreasuryTipContent({ data }) {
  return (
    <>
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
