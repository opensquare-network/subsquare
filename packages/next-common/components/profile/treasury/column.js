import { isNil } from "lodash-es";
import { ClosedTag } from "next-common/components/tags/state/styled";
import {
  SpendTag,
  TreasuryTag,
  BountyTag,
  ChildBountyTag,
  TipTag,
} from "next-common/components/tags/state/treasury";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { CHAIN } from "next-common/utils/constants";
import businessCategory from "next-common/utils/consts/business/category";
import getChainSettings from "next-common/utils/consts/settings";

export function getStatusTagColumn({ category } = {}) {
  let Tag = ClosedTag;
  if (category === businessCategory.treasurySpends) {
    Tag = SpendTag;
  } else if (category === businessCategory.treasuryProposals) {
    Tag = TreasuryTag;
  } else if (category === businessCategory.treasuryBounties) {
    Tag = BountyTag;
  } else if (category === businessCategory.treasuryChildBounties) {
    Tag = ChildBountyTag;
  } else if (category === businessCategory.treasuryTips) {
    Tag = TipTag;
  }
  return {
    name: "Status",
    className: "text-right w-[120px]",
    cellRender(data) {
      return <Tag state={data.status} />;
    },
  };
}

export function getRequestColumn() {
  return {
    name: "Request",
    className: "w-40 text-left",
    cellRender(data) {
      const { decimals, symbol } = getChainSettings(CHAIN);
      const fiatValue = !isNil(data.fiatValue)
        ? toPrecision(data.fiatValue, 0, 2)
        : null;
      if (!isNil(data.value)) {
        return (
          <ValueDisplay
            className="text14Medium text-textPrimary"
            value={toPrecision(data.value, decimals)}
            symbol={symbol}
            tooltipOtherContent={
              !isNil(fiatValue) && (
                <>
                  <br />${Number(fiatValue).toLocaleString()}
                </>
              )
            }
          />
        );
      }

      return "--";
    },
  };
}
