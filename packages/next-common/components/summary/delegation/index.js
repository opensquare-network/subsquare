import { useCallback } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { useTrackDelegating } from "next-common/utils/hooks/referenda/useTrackDelegating";
import useApi from "next-common/utils/hooks/useApi";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import DelegationInfo from "next-common/components/summary/democracySummaryDelegation/democracySummaryDelegationInfo";
import DelegationButton from "./delegationButton";
import { clearVotingForEntries } from "next-common/utils/gov2/gov2ReferendumVote";
import { useChainSettings } from "next-common/context/chain";
import { incMyReferendaDelegationsTrigger } from "next-common/store/reducers/myOnChainData/referenda/myReferendaDelegations";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
`;

export default function Delegation({ trackId }) {
  const dispatch = useDispatch();
  const api = useApi();
  const realAddress = useRealAddress();
  const { delegating, refresh } = useTrackDelegating(api, trackId, realAddress);
  const { hideActionButtons } = useChainSettings();

  const onDelegateInBlock = useCallback(() => {
    clearVotingForEntries();
    refresh();
    dispatch(incMyReferendaDelegationsTrigger());
    dispatch(newSuccessToast("Delegate success"));
  }, [dispatch, refresh]);

  const onUndelegateInBlock = useCallback(() => {
    clearVotingForEntries();
    refresh();
    dispatch(newSuccessToast("Undelegated"));
  }, [dispatch, refresh]);

  return (
    <Wrapper>
      <DelegationInfo delegating={delegating} />
      {!hideActionButtons && (
        <DelegationButton
          delegating={delegating}
          trackId={trackId}
          onDelegateInBlock={onDelegateInBlock}
          onUndelegateInBlock={onUndelegateInBlock}
        />
      )}
    </Wrapper>
  );
}
