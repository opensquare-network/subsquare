import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import SecondaryButton from "next-common/lib/button/secondary";
import { SystemPlus } from "@osn/icons/subsquare";
import useIsUseMetamask from "next-common/hooks/useIsUseMetamask";
import isMoonChain from "next-common/utils/isMoonChain";
import { clearVotingForEntries } from "next-common/utils/gov2/gov2ReferendumVote";
import { incMyReferendaDelegationsTrigger } from "next-common/store/reducers/myOnChainData/referenda/myReferendaDelegations";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import dynamic from "next/dynamic";

const DelegatePopup = dynamic(
  () => import("next-common/components/gov2/delegatePopup"),
  {
    ssr: false,
  },
);

const MoonDelegatePopup = dynamic(
  () => import("next-common/components/gov2/delegatePopup/moonPopup"),
  {
    ssr: false,
  },
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
        <Popup
          defaultTargetAddress={defaultTargetAddress}
          targetDisabled={targetDisabled}
          onInBlock={onDelegateInBlock}
          onClose={() => setShowDelegatePopup(false)}
        />
      )}
    </>
  );
}
