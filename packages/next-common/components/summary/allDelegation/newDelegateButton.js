import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import SecondaryButton from "next-common/lib/button/secondary";
import { SystemPlus } from "@osn/icons/subsquare";
import { clearVotingForEntries } from "next-common/utils/gov2/gov2ReferendumVote";
import { incMyReferendaDelegationsTrigger } from "next-common/store/reducers/myOnChainData/referenda/myReferendaDelegations";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import dynamicPopup from "next-common/lib/dynamic/popup";

const DelegatePopup = dynamicPopup(() =>
  import("next-common/components/gov2/delegatePopup"),
);

/**
 * @param {{
 * defaultTargetAddress?: string
 * targetDisabled?: boolean
 * } & ButtonProps} props
 */
export default function NewDelegateButton({
  defaultTargetAddress,
  targetDisabled,
  size = "small",
  ...props
}) {
  const dispatch = useDispatch();
  const [showDelegatePopup, setShowDelegatePopup] = useState(false);

  const onDelegateInBlock = useCallback(() => {
    clearVotingForEntries();
    dispatch(incMyReferendaDelegationsTrigger());
    dispatch(newSuccessToast("Delegate success"));
  }, [dispatch]);

  return (
    <>
      <SecondaryButton
        size={size}
        iconLeft={<SystemPlus className="w-4 h-4" />}
        {...props}
        onClick={() => {
          setShowDelegatePopup(true);
        }}
      >
        {props.children || "Delegate"}
      </SecondaryButton>
      {showDelegatePopup && (
        <DelegatePopup
          defaultTargetAddress={defaultTargetAddress}
          targetDisabled={targetDisabled}
          onInBlock={onDelegateInBlock}
          onClose={() => setShowDelegatePopup(false)}
        />
      )}
    </>
  );
}
