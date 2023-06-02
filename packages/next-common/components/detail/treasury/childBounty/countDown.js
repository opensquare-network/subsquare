import React from "react";
import { NoticeWrapper } from "../../../styled/containers/titleContainer";
import TreasuryCountDown from "../../../treasury/common/countdown";
import { useSelector } from "react-redux";
import { childBountySelector } from "../../../../store/reducers/childBountySlice";

export default function ChildBountyCountDown({ data = {} }) {
  const childBounty = useSelector(childBountySelector);
  if (data.state?.state !== "PendingPayout" || !childBounty) {
    return null;
  }

  const timeline = data.timeline ?? [];
  const awardedItem = [...timeline]
    .reverse()
    .find((item) => item.name === "Awarded");
  if (!awardedItem) {
    return null;
  }

  return (
    <NoticeWrapper>
      <TreasuryCountDown
        startHeight={ awardedItem.indexer?.blockHeight }
        targetHeight={ data.unlockAt }
        prefix="Claimable"
      />
    </NoticeWrapper>
  );
}
