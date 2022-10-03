import { detailPageCategory } from "../../../utils/consts/business/category";
import { DemocracyTag, TreasuryTag } from "../../tags/business";

export default function TypeTag({ type }) {
  let tag;
  if (
    [
      detailPageCategory.DEMOCRACY_PROPOSAL,
      detailPageCategory.DEMOCRACY_EXTERNAL,
      detailPageCategory.DEMOCRACY_REFERENDUM,
    ].includes(type)
  ) {
    tag = <DemocracyTag />
  } else if (
    [
      detailPageCategory.TREASURY_TIP,
      detailPageCategory.TREASURY_PROPOSAL,
      detailPageCategory.TREASURY_BOUNTY,
      detailPageCategory.TREASURY_CHILD_BOUNTY,
    ].includes(type)
  ) {
    tag = <TreasuryTag/>
  }

  if (!tag) {
    return null
  }

  return (
    <div>{ tag }</div>
  )
}
