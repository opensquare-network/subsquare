import { ClosedTag } from "next-common/components/tags/state/styled";
import {
  SpendTag,
  TreasuryTag,
  BountyTag,
  ChildBountyTag,
  TipTag,
} from "next-common/components/tags/state/treasury";
import businessCategory from "next-common/utils/consts/business/category";

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
      return <Tag state={data.state} />;
    },
  };
}
