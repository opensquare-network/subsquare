import React, { useCallback } from "react";
import { useState } from "react";
import { Button } from "../styled";
import RemoveSVG from "next-common/assets/imgs/icons/remove.svg";
import UndelegatePopup from "./undelegatePopup";
import MoonUndelegatePopup from "./undelegatePopup/moonPopup";
import styled from "styled-components";
import Tooltip from "../../tooltip";
import isMoonChain from "next-common/utils/isMoonChain";
import useIsUseMetamask from "next-common/hooks/useIsUseMetamask";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";

const RemoveButton = styled(Button)`
  display: flex;
  padding: 7px;
`;

export default function DemocracyRemoveDelegation({ refresh }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showUndelegatePopup, setShowUndelegatePopup] = useState(false);
  const isUseMetamask = useIsUseMetamask();

  const dispatch = useDispatch();
  const onUndelegateInBlock = useCallback(() => {
    refresh();
    dispatch(newSuccessToast("Undelegated"));
  }, [dispatch, refresh]);

  let TheUndelegatePopup = UndelegatePopup;
  if (isMoonChain() && isUseMetamask) {
    TheUndelegatePopup = MoonUndelegatePopup;
  }

  return (
    <>
      <Tooltip content="Remove">
        <div>
          <RemoveButton
            disabled={isLoading}
            onClick={() => setShowUndelegatePopup(true)}
          >
            <RemoveSVG />
          </RemoveButton>
        </div>
      </Tooltip>
      {showUndelegatePopup && (
        <TheUndelegatePopup
          onInBlock={onUndelegateInBlock}
          onClose={() => setShowUndelegatePopup(false)}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}
    </>
  );
}
