import React from "react";
import { NoticeWrapper } from "../../../styled/containers/titleContainer";
import TreasuryCountDown from "../../../treasury/common/countdown";

/**
 *
 * @param data bounty on chain data
 * @constructor
 */
export default function BountyCountDown({ data = {} }) {
  if (data.state?.state !== "PendingPayout") {
    return null;
  }

  const { meta: { status: { pendingPayout: { unlockAt } = {} } = {} } = {} } =
    data;

  const timeline = data.timeline ?? [];
  const awardedItem = [...timeline]
    .reverse()
    .find((item) => [item.name, item.method].includes("BountyAwarded"));
  if (!awardedItem || !unlockAt) {
    return null;
  }

  return (
    <NoticeWrapper>
      <TreasuryCountDown
        startHeight={awardedItem.indexer?.blockHeight}
        targetHeight={unlockAt}
        prefix="Claimable"
      />
    </NoticeWrapper>
  );
}
