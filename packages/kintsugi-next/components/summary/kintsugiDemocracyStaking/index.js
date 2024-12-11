import React from "react";
import styled from "styled-components";
import DemocracySummaryStakeInfo from "./democracySummaryStackInfo";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useLatestAddressVotingBalance } from "utils/hooks";
import DemocracySummaryStakeButton from "./democracySummaryStakeButton";
import { useContextApi } from "next-common/context/api";
import useSubStorage from "next-common/hooks/common/useSubStorage";
import WithAddress from "next-common/components/common/withAddress";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
`;

function StakingContent() {
  const api = useContextApi();
  const realAddress = useRealAddress();
  const { balance: votingBalance, isLoading: isLoadingVotingBalance } =
    useLatestAddressVotingBalance(api, realAddress);
  const { result: rawBalance, loading: isLoadingLocked } = useSubStorage(
    "escrow",
    "locked",
    [realAddress],
  );

  if (isLoadingVotingBalance || isLoadingLocked) {
    return null;
  }

  return (
    <Wrapper>
      <DemocracySummaryStakeInfo
        votingBalance={votingBalance}
        balance={rawBalance ? rawBalance.amount.toString() : null}
      />
      <DemocracySummaryStakeButton />
    </Wrapper>
  );
}

export default function KintsugiDemocracyStaking() {
  return (
    <WithAddress>
      <StakingContent />
    </WithAddress>
  );
}
