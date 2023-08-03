import React from "react";
import styled from "styled-components";
import useApi from "next-common/utils/hooks/useApi";
import DemocracySummaryStakeInfo from "./democracySummaryStackInfo";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useLatestAddressVotingBalance } from "utils/hooks";
import DemocracySummaryStakeButton from "./democracySummaryStakeButton";
import useSubLockedBalance from "../../../hooks/democracy/useSubLockedBalance";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
`;

export default function KintsugiDemocracyStaking() {
  const api = useApi();
  const realAddress = useRealAddress();
  const [votingBalance] = useLatestAddressVotingBalance(api, realAddress);
  const balance = useSubLockedBalance(realAddress);

  return (
    <Wrapper>
      <DemocracySummaryStakeInfo
        votingBalance={votingBalance}
        balance={balance}
      />
      <DemocracySummaryStakeButton />
    </Wrapper>
  );
}
