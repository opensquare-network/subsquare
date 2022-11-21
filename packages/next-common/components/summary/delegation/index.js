import styled from "styled-components";
import DelegationInfo from "./delegationInfo";
import DelegationButton from "./delegationButton";
import useTrackDelegating from "next-common/utils/hooks/referenda/useTrackDelegation";
import useApi from "../../../utils/hooks/useApi";
import { useUser } from "../../../context/user";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { newSuccessToast } from "../../../store/reducers/toastSlice";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export default function Delegation({ trackId }) {
  const dispatch = useDispatch();
  const api = useApi();
  const loginUser = useUser();
  const { delegating, refresh } = useTrackDelegating(
    api,
    trackId,
    loginUser?.address
  );

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
      <DelegationInfo delegating={delegating} />
      <DelegationButton
        delegating={delegating}
        trackId={trackId}
        onDelegateInBlock={onDelegateInBlock}
        onUndelegateInBlock={onUndelegateInBlock}
      />
    </Wrapper>
  );
}
