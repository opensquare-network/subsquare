import React, { useCallback, useState } from "react";
import Signer from "next-common/components/popup/fields/signerField";
import PopupWithSigner from "../../../components/popupWithSigner";
import Title from "./title";
import Link from "./link";
import Description from "./description";
import PrimaryButton from "next-common/components/buttons/primaryButton";
import nextApi from "../../../services/nextApi";
import { useDispatch } from "react-redux";
import {
  newErrorToast,
  newSuccessToast,
} from "../../../store/reducers/toastSlice";
import DateField from "./dateField";
import DateSelectModal from "../dateSelectModal";
import noop from "lodash.noop";
import { calendarUserEventsApi } from "../../../services/url";
import { PopupButtonWrapper } from "../../popup/wrapper";

function PopupContent({ onClose, refresh = noop }) {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [showStartDateSelectModal, setShowStartDateSelectModal] =
    useState(false);
  const [showEndDateSelectModal, setShowEndDateSelectModal] = useState(false);

  const showErrorToast = (message) => dispatch(newErrorToast(message));
  const showSuccessToast = (message) => dispatch(newSuccessToast(message));

  const submit = useCallback(async () => {
    if (!title) {
      return showErrorToast("Please fill the title.");
    }

    if (!description) {
      return showErrorToast("Please fill the description.");
    }

    if (!startDate) {
      return showErrorToast("Please select the start date.");
    }

    if (startDate.getTime() < Date.now()) {
      return showErrorToast("Start date must be in the future.");
    }

    if (endDate && endDate.getTime() < startDate.getTime()) {
      return showErrorToast("End date must be after start date.");
    }

    setIsLoading(true);
    try {
      const { result, error } = await nextApi.post(
        calendarUserEventsApi,
        {
          title,
          link,
          description,
          timestamp: startDate.getTime(),
          endTimestamp: endDate?.getTime(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (error) {
        return showErrorToast(error.message);
      }

      if (result) {
        showSuccessToast("Event created.");
        onClose();
        refresh();
      }
    } finally {
      setIsLoading(false);
    }
  }, [title, link, description, startDate, endDate]);

  const onSelectStartDate = useCallback((date) => {
    setStartDate(date);
  }, []);

  const onSelectEndDate = useCallback((date) => {
    setEndDate(date);
  }, []);

  return (
    <>
      <Signer />
      <Title setValue={setTitle} />
      <Description setValue={setDescription} />
      <DateField
        title="Start date"
        value={startDate}
        onClick={() => setShowStartDateSelectModal(true)}
      />
      <DateField
        title="End date"
        optional
        value={endDate}
        onClick={() => setShowEndDateSelectModal(true)}
      />
      <Link setValue={setLink} />
      <PopupButtonWrapper>
        <PrimaryButton isLoading={isLoading} onClick={submit}>
          Submit
        </PrimaryButton>
      </PopupButtonWrapper>
      {showStartDateSelectModal && (
        <DateSelectModal
          onClose={() => setShowStartDateSelectModal(false)}
          defaultSelectedDate={startDate}
          onSelect={onSelectStartDate}
        />
      )}
      {showEndDateSelectModal && (
        <DateSelectModal
          onClose={() => setShowEndDateSelectModal(false)}
          defaultSelectedDate={endDate}
          onSelect={onSelectEndDate}
        />
      )}
    </>
  );
}

export default function CreateEventModal(props) {
  return (
    <PopupWithSigner title="Create Event" Component={PopupContent} {...props} />
  );
}
