import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import dynamicPopup from "next-common/lib/dynamic/popup";
import Input from "next-common/lib/input";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import useRenameSubIdentity from "../../hooks/useRenameSubIdentity";
import Account from "next-common/components/account";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import PopupLabel from "next-common/components/popup/label";
import SecondaryButton from "next-common/lib/button/secondary";

const Popup = dynamicPopup(() =>
  import("next-common/components/popup/wrapper/Popup"),
);

export default function RenameSubPopup({
  address,
  currentName,
  onClose,
  onSuccess,
}) {
  const [newName, setNewName] = useState(currentName || "");
  const getTxFunc = useRenameSubIdentity(address, newName);
  const dispatch = useDispatch();

  const onInBlock = useCallback(() => {
    dispatch(newSuccessToast("Sub identity renamed successfully"));
    onSuccess?.();
    onClose();
  }, [dispatch, onSuccess, onClose]);

  const isDisabled = !newName || newName === currentName;

  return (
    <Popup title="Rename Sub Identity" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <PopupLabel text="Identity"/>
          <GreyPanel className="py-3 px-4 gap-4">
            <Account account={{ address }} />
          </GreyPanel>
        </div>
        <div>
          <PopupLabel text="Current Name"/>
          <div className="text14Medium text-textPrimary p-3 bg-neutral200 rounded">
            {currentName}
          </div>
        </div>
        <div>
          <PopupLabel text="New Name"/>
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter new name"
          />
        </div>
        <div className="flex justify-end gap-x-2">
          <SecondaryButton onClick={onClose}>
            Cancel
          </SecondaryButton>
          <TxSubmissionButton
            size="small"
            title="Confirm"
            getTxFunc={getTxFunc}
            onInBlock={onInBlock}
            disabled={isDisabled}
          />
        </div>
      </div>
    </Popup>
  );
}
