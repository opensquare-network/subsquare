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
import DangerButton from "../../../../buttons/dangerButton";
import { noop } from "lodash-es";
import { PopupButtonWrapper } from "../../../../popup/wrapper";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";

export default function DeleteEventModal({ event, onClose, refresh = noop }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { ensureLogin } = useEnsureLogin();

  const showErrorToast = (message) => dispatch(newErrorToast(message));
  const showSuccessToast = (message) => dispatch(newSuccessToast(message));

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
  }, [dispatch, onClose, event?._id, ensureLogin]);

  return (
    <Popup title="Delete" onClose={onClose}>
      <ErrorMessage>
        Are you sure you would like to delete this user event from the calendar?
      </ErrorMessage>
      <PopupButtonWrapper>
        <DangerButton onClick={deleteEvent} isLoading={isLoading}>
          Delete
        </DangerButton>
      </PopupButtonWrapper>
    </Popup>
  );
}
