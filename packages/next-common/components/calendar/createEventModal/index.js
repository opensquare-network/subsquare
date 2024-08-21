import React, { useCallback, useState } from "react";
import Signer from "next-common/components/popup/fields/signerField";
import PopupWithSigner from "../../../components/popupWithSigner";
import Title from "./title";
import Link from "./link";
import Description from "./description";
import PrimaryButton from "next-common/lib/button/primary";
import nextApi from "../../../services/nextApi";
import { useDispatch } from "react-redux";
import {
  newErrorToast,
  newSuccessToast,
} from "../../../store/reducers/toastSlice";
import DateField from "./dateField";
import DateSelectModal from "../dateSelectModal";
import { noop } from "lodash-es";
import { calendarUserEventsApi } from "../../../services/url";
import { PopupButtonWrapper } from "../../popup/wrapper";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import { usePopupParams } from "next-common/components/popupWithSigner/context";

function PopupContent() {
  const { onClose, refresh = noop } = usePopupParams();
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
  const { ensureLogin } = useEnsureLogin();

  const showErrorToast = useCallback(
    (message) => dispatch(newErrorToast(message)),
    [],
  );
  const showSuccessToast = useCallback(
    (message) => dispatch(newSuccessToast(message)),
    [],
  );

  const submit = useCallback(async () => {
    if (!title) {
      showErrorToast("Please fill the title.");
      return;
    }

    if (!description) {
      showErrorToast("Please fill the description.");
      return;
    }

    if (!startDate) {
      showErrorToast("Please select the start date.");
      return;
    }

    if (startDate.getTime() < Date.now()) {
      showErrorToast("Start date must be in the future.");
      return;
    }

    if (endDate && endDate.getTime() < startDate.getTime()) {
      showErrorToast("End date must be after start date.");
      return;
    }

    setIsLoading(true);
    try {
      if (!(await ensureLogin())) {
        return;
      }

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
        showErrorToast(error.message);
        return;
      }

      if (result) {
        showSuccessToast("Event created.");
        onClose();
        refresh();
      }
    } finally {
      setIsLoading(false);
    }
  }, [
    title,
    link,
    description,
    startDate,
    endDate,
    refresh,
    onClose,
    showErrorToast,
    showSuccessToast,
    ensureLogin,
  ]);

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
        <PrimaryButton loading={isLoading} onClick={submit}>
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
    <PopupWithSigner title="Create Event" {...props}>
      <PopupContent />
    </PopupWithSigner>
  );
}
