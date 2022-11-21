import styled from "styled-components";
import DelegationInfo from "./delegationInfo";
import DelegationButton from "./delegationButton";
import { useGov2TrackDelegating } from "utils/hooks";
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
  const { delegating, refresh } = useGov2TrackDelegating(
    api,
    trackId,
    loginUser?.address
  );

  const onInBlock = useCallback(() => {
    refresh();
    dispatch(newSuccessToast(`Undelegated`));
  }, [dispatch, refresh]);

  return (
    <Wrapper>
      <DelegationInfo delegating={delegating} />
      <DelegationButton
        delegating={delegating}
        trackId={trackId}
        onInBlock={onInBlock}
      />
    </Wrapper>
  );
}
