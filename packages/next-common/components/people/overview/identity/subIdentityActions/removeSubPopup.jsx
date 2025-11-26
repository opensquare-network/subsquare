import { useCallback } from "react";
import { useDispatch } from "react-redux";
import dynamicPopup from "next-common/lib/dynamic/popup";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import useRemoveSubIdentity from "../../hooks/useRemoveSubIdentity";
import { PopupButtonWrapper } from "next-common/components/popup/wrapper";
import SecondaryButton from "next-common/lib/button/secondary";
import Account from "next-common/components/account";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import PopupLabel from "next-common/components/popup/label";
import Input from "next-common/lib/input";

const Popup = dynamicPopup(() =>
  import("next-common/components/popup/wrapper/Popup"),
);

export default function RemoveSubPopup({
  address,
  currentName,
  onClose,
  onSuccess,
}) {
  const getTxFunc = useRemoveSubIdentity(address);
  const dispatch = useDispatch();

  const onInBlock = useCallback(() => {
    dispatch(newSuccessToast("Sub identity removed successfully"));
    onSuccess?.();
    onClose();
  }, [dispatch, onSuccess, onClose]);

  return (
    <Popup title="Remove Sub Identity" onClose={onClose}>
      <PopupLabel text={"Identity"} />
      <GreyPanel className="py-3 px-4 gap-4">
        <Account account={{ address }} />
      </GreyPanel>
      <PopupLabel text={"Name"} />
      <Input disabled={true} value={currentName} />
      <PopupButtonWrapper className="gap-[8px]">
        <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
        <TxSubmissionButton
          title="Confirm"
          getTxFunc={getTxFunc}
          onInBlock={onInBlock}
        />
      </PopupButtonWrapper>
    </Popup>
  );
}
