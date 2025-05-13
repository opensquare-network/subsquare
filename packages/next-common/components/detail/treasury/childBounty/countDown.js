import React from "react";
import { NoticeWrapper } from "../../../styled/containers/titleContainer";
import TreasuryCountDown from "../../../treasury/common/countdown";
import useChainOrScanHeight from "next-common/hooks/height";
import { isNil } from "lodash-es";

export default function ChildBountyCountDown({ data = {} }) {
  const chainHeight = useChainOrScanHeight();
  if (data.state?.state !== "PendingPayout" || isNil(chainHeight)) {
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
        startHeight={awardedItem.indexer?.blockHeight}
        targetHeight={data.unlockAt}
        prefix="Claimable"
      />
    </NoticeWrapper>
  );
}
