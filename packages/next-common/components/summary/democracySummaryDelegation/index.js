import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import DemocracySummaryDelegationInfo from "./democracySummaryDelegationInfo";
import DemocracySummaryDelegationButton from "./democracySummaryDelegationButton";
import useDemocracyDelegating from "../../../utils/hooks/referenda/useDemocracyDelegating";
import useRealAddress from "../../../utils/hooks/useRealAddress";
import { useChainSettings } from "next-common/context/chain";
import { useContextApi } from "next-common/context/api";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export default function DemocracySummaryDelegation() {
  const dispatch = useDispatch();
  const api = useContextApi();
  const realAddress = useRealAddress();
  const { delegating, refresh } = useDemocracyDelegating(api, realAddress);
  const { hideActionButtons } = useChainSettings();

  const onDelegateInBlock = useCallback(() => {
    refresh();
    dispatch(newSuccessToast("Delegate success"));
  }, [dispatch, refresh]);

  const onUndelegateInBlock = useCallback(() => {
    refresh();
    dispatch(newSuccessToast("Undelegated"));
  }, [dispatch, refresh]);

  return (
    <Wrapper>
      <DemocracySummaryDelegationInfo delegating={delegating} />
      {!hideActionButtons && (
        <DemocracySummaryDelegationButton
          delegating={delegating}
          onDelegateInBlock={onDelegateInBlock}
          onUndelegateInBlock={onUndelegateInBlock}
        />
      )}
    </Wrapper>
  );
}
