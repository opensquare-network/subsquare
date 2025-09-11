import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import nextApi from "next-common/services/nextApi";
import Popup from "../../../../../components/popup/wrapper/Popup";
import {
  newErrorToast,
  newSuccessToast,
} from "../../../../../store/reducers/toastSlice";
import { calendarUserEventsApi } from "../../../../../services/url";
import ErrorMessage from "../../../../styled/errorMessage";
import DangerButton from "next-common/lib/button/danger";
import { noop } from "lodash-es";
import { PopupButtonWrapper } from "../../../../popup/wrapper";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";

export default function DeleteEventModal({ event, onClose, refresh = noop }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { ensureLogin } = useEnsureLogin();

  const showErrorToast = useCallback(
    (message) => dispatch(newErrorToast(message)),
    [dispatch],
  );
  const showSuccessToast = useCallback(
    (message) => dispatch(newSuccessToast(message)),
    [dispatch],
  );

  const deleteEvent = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!(await ensureLogin())) {
        return;
      }

      const { result, error } = await nextApi.delete(
        `${calendarUserEventsApi}/${event?._id}`,
      );
      if (error) {
        showErrorToast(error.message);
        return;
      }
      if (result) {
        showSuccessToast("User event has been deleted successfully");
        onClose();
        refresh();
        return;
      }
    } finally {
      setIsLoading(false);
    }
  }, [
    ensureLogin,
    event?._id,
    showErrorToast,
    showSuccessToast,
    onClose,
    refresh,
  ]);

  return (
    <Popup title="Delete" onClose={onClose}>
      <ErrorMessage>
        Are you sure you would like to delete this user event from the calendar?
      </ErrorMessage>
      <PopupButtonWrapper>
        <DangerButton onClick={deleteEvent} loading={isLoading}>
          Delete
        </DangerButton>
      </PopupButtonWrapper>
    </Popup>
  );
}
