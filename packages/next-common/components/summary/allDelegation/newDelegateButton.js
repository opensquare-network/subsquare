import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "next-common/components/summary/styled";
import DelegatePopup from "next-common/components/gov2/delegatePopup";
import MoonDelegatePopup from "next-common/components/gov2/delegatePopup/moonPopup";
import AddSVG from "next-common/assets/imgs/icons/add.svg";
import useIsUseMetamask from "next-common/hooks/useIsUseMetamask";
import isMoonChain from "next-common/utils/isMoonChain";
import { clearVotingForEntries } from "next-common/utils/gov2/gov2ReferendumVote";
import { incMyReferendaDelegationsTrigger } from "next-common/store/reducers/myOnChainData/referenda/myReferendaDelegations";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";

export default function NewDelegateButton() {
  const dispatch = useDispatch();
  const [showDelegatePopup, setShowDelegatePopup] = useState(false);
  const isUseMetamask = useIsUseMetamask();

  let Popup = DelegatePopup;
  if (isMoonChain() && isUseMetamask) {
    Popup = MoonDelegatePopup;
  }

  const onDelegateInBlock = useCallback(() => {
    clearVotingForEntries();
    dispatch(incMyReferendaDelegationsTrigger());
    dispatch(newSuccessToast("Delegate success"));
  }, [dispatch]);

  return (
    <>
      <Button onClick={() => setShowDelegatePopup(true)}>
        <AddSVG />
        New Delegate
      </Button>
      {showDelegatePopup && (
        <Popup
          onInBlock={onDelegateInBlock}
          onClose={() => setShowDelegatePopup(false)}
        />
      )}
    </>
  );
}
