import React, { useCallback, useState } from "react";
import { SystemTrash } from "@osn/icons/subsquare";
import nextApi from "next-common/services/nextApi";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";
import Popup from "../popup/wrapper/Popup";
import SecondaryButton from "next-common/lib/button/secondary";
import PrimaryButton from "next-common/lib/button/primary";
import { fetchAndUpdateUser, useUserContext } from "next-common/context/user";
import Tooltip from "../tooltip";

function DeletePopup({ onClose }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState();
  const userContext = useUserContext();

  const doDelete = useCallback(async () => {
    setIsLoading(true);
    try {
      const { error } = await nextApi.post("user/telegram/unlink");
      if (error) {
        dispatch(newErrorToast(error.message));
        return;
      }
      onClose();
      fetchAndUpdateUser(userContext);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, onClose, userContext]);

  return (
    <Popup title="Unlink Confirmation" onClose={onClose}>
      <div>
        <span className="text14Medium text-textPrimary">
          Unlink this telegram channel from subsquare account. You will not
          receive notifications from this channel.
        </span>
      </div>
      <div className="flex gap-[8px] justify-end">
        <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
        <PrimaryButton
          loading={isLoading}
          className="!bg-red500"
          onClick={doDelete}
        >
          Unlink
        </PrimaryButton>
      </div>
    </Popup>
  );
}

export default function DeleteChannel() {
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  return (
    <div className="flex items-center [&_svg_path]:fill-textPrimary">
      <Tooltip content={"Unlink"}>
        <SystemTrash
          className="cursor-pointer"
          onClick={() => setShowDeletePopup(true)}
        />
      </Tooltip>
      {showDeletePopup && (
        <DeletePopup onClose={() => setShowDeletePopup(false)} />
      )}
    </div>
  );
}
