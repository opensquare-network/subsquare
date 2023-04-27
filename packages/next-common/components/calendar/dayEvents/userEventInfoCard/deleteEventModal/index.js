import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import nextApi from "next-common/services/nextApi";
import Popup from "../../../../../components/popup/wrapper/Popup";
import { newErrorToast, newSuccessToast } from "../../../../../store/reducers/toastSlice";
import { calendarUserEventsApi } from "../../../../../services/url";
import ErrorMessage from "../../../../styled/errorMessage";
import DangerButton from "../../../../buttons/dangerButton";
import noop from "lodash.noop";
import { PopupButtonWrapper } from "../../../../popup/wrapper";

export default function DeleteEventModal({ event, onClose, refresh = noop }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const showErrorToast = (message) => dispatch(newErrorToast(message));
  const showSuccessToast = (message) => dispatch(newSuccessToast(message));

  const deleteEvent = useCallback(async () => {
    setIsLoading(true);
    try {
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
  }, [dispatch, onClose, event?._id]);

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
