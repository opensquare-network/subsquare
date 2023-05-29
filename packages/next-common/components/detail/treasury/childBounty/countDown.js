import React from "react";
import { NoticeWrapper } from "../../../styled/containers/titleContainer";
import TreasuryCountDown from "../../../treasury/common/countdown";

export default function ChildBountyCountDown({ data = {} }) {
  if (data.state?.state !== "PendingPayout") {
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
