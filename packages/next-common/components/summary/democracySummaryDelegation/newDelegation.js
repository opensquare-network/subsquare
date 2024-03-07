import React, { useCallback } from "react";
import { useState } from "react";
import { Button } from "../styled";
import DelegatePopup from "next-common/components/democracy/delegatePopup";
import MoonDelegatePopup from "next-common/components/democracy/delegatePopup/moonPopup";
import AddSVG from "next-common/assets/imgs/icons/add.svg";
import isMoonChain from "next-common/utils/isMoonChain";
import useIsUseMetamask from "next-common/hooks/useIsUseMetamask";
import { useDispatch } from "react-redux";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";

export default function DemocracyNewDelegation({ refresh }) {
  const [showDelegatePopup, setShowDelegatePopup] = useState(false);
  const isUseMetamask = useIsUseMetamask();

  const dispatch = useDispatch();
  const onDelegateInBlock = useCallback(() => {
    refresh();
    dispatch(newSuccessToast("Delegate success"));
  }, [dispatch, refresh]);

  let TheDelegatePopup = DelegatePopup;
  if (isMoonChain() && isUseMetamask) {
    TheDelegatePopup = MoonDelegatePopup;
  }

  return (
    <>
      <Button onClick={() => setShowDelegatePopup(true)}>
        <AddSVG />
        New Delegate
      </Button>
      {showDelegatePopup && (
        <TheDelegatePopup
          onInBlock={onDelegateInBlock}
          onClose={() => setShowDelegatePopup(false)}
        />
      )}
    </>
  );
}
