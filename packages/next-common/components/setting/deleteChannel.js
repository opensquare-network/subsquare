import React, { useCallback, useState } from "react";
import { SystemTrash } from "@osn/icons/subsquare";
import nextApi from "next-common/services/nextApi";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";
import Popup from "../popup/wrapper/Popup";
import GhostButton from "../buttons/ghostButton";
import PrimaryButton from "../buttons/primaryButton";
import { fetchAndUpdateUser, useUserDispatch } from "next-common/context/user";
import Tooltip from "../tooltip";

function DeletePopup({ onClose }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState();
  const userDispatch = useUserDispatch();

  const doDelete = useCallback(async () => {
    setIsLoading(true);
    try {
      const { error } = await nextApi.post("user/telegram/unlink");
      if (error) {
        dispatch(newErrorToast(error.message));
        return;
      }
      onClose();
      fetchAndUpdateUser(userDispatch);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <Popup title="Unlink Confirmation" onClose={onClose}>
      <div>
        <span className="text14Medium text-textPrimary">
          Unlink this telegram channel from subsquare account. You will not
          receive notifications from this channel.
        </span>
      </div>
      <div className="flex gap-[8px] justify-end">
        <GhostButton onClick={onClose}>Cancel</GhostButton>
        <PrimaryButton
          isLoading={isLoading}
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
    <div className="flex items-center ml-[8px] [&_svg_path]:fill-textPrimary">
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
