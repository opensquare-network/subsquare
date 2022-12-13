import React from "react";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import useApi from "next-common/utils/hooks/useApi";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import DemocracySummaryStackInfo from "./democracySummaryStackInfo";
import DemocracySummaryStackButton from "./democracySummaryStackButton";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useAddressVotingBalance } from "utils/hooks";
import useAddressBalance from "next-common/utils/hooks/useAddressBalance";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
`;

export default function KintsugiDemocracyStacking() {
  const dispatch = useDispatch();
  const api = useApi();
  const realAddress = useRealAddress();
  const [votingBalance, , refresh] = useAddressVotingBalance(api, realAddress);
  const [balance] = useAddressBalance(api, realAddress);

  const onStackInBlock = useCallback(() => {
    refresh();
    dispatch(newSuccessToast(`Stack success`));
  }, [dispatch, refresh]);

  return (
    <Wrapper>
      <DemocracySummaryStackInfo
        votingBalance={votingBalance}
        balance={balance}
      />
      <DemocracySummaryStackButton onStackInBlock={onStackInBlock} />
    </Wrapper>
  );
}
