import React from "react";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import useApi from "next-common/utils/hooks/useApi";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import DemocracySummaryDelegationInfo from "./democracySummaryDelegationInfo";
import DemocracySummaryDelegationButton from "./democracySummaryDelegationButton";
import useDemocracyDelegating from "../../utils/hooks/referenda/useDemocracyDelegating";
import useRealAddress from "../../utils/hooks/useRealAddress";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
`;

export default function DemocracySummaryDelegation() {
  const dispatch = useDispatch();
  const api = useApi();
  const realAddress = useRealAddress();
  const { delegating, refresh } = useDemocracyDelegating(api, realAddress);

  const onDelegateInBlock = useCallback(() => {
    refresh();
    dispatch(newSuccessToast(`Delegate success`));
  }, [dispatch, refresh]);

  const onUndelegateInBlock = useCallback(() => {
    refresh();
    dispatch(newSuccessToast(`Undelegated`));
  }, [dispatch, refresh]);

  return (
    <Wrapper>
      <DemocracySummaryDelegationInfo delegating={delegating} />
      <DemocracySummaryDelegationButton
        delegating={delegating}
        onDelegateInBlock={onDelegateInBlock}
        onUndelegateInBlock={onUndelegateInBlock}
      />
    </Wrapper>
  );
}
