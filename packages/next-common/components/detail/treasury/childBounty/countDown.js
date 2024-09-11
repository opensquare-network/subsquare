import React from "react";
import { NoticeWrapper } from "../../../styled/containers/titleContainer";
import TreasuryCountDown from "../../../treasury/common/countdown";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { useSelector } from "react-redux";
import { isNil } from "lodash-es";

export default function ChildBountyCountDown({ data = {} }) {
  const chainHeight = useSelector(chainOrScanHeightSelector);
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
        startHeight={ awardedItem.indexer?.blockHeight }
        targetHeight={ data.unlockAt }
        prefix="Claimable"
      />
    </NoticeWrapper>
  );
}
