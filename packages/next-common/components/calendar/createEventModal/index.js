import React, { useCallback, useState } from "react";
import styled from "styled-components";
import Signer from "next-common/components/popup/fields/signerField";
import PopupWithAddress from "../../../components/popupWithAddress";
import useSignerAccount from "../../../utils/hooks/useSignerAccount";
import Title from "./title";
import Link from "./link";
import Description from "./description";
import SecondaryButton from "../../buttons/secondaryButton";
import nextApi from "../../../services/nextApi";
import { useDispatch } from "react-redux";
import { newErrorToast } from "../../../store/reducers/toastSlice";
import StartDate from "./startDate";
import DateSelectModal from "../dateSelectModal";

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

function PopupContent({ extensionAccounts, onClose }) {
  const dispatch = useDispatch();
  const signerAccount = useSignerAccount(extensionAccounts);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [showDateSelectModal, setShowDateSelectModal] = useState(false);

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const submit = useCallback(async () => {
    if (!title) {
      return showErrorToast("Please fill the title.");
    }

    if (!link) {
      return showErrorToast("Please fill the link.");
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

    setIsLoading(true);
    try {
      const { result, error } = await nextApi.post(
        "events",
        {
          title,
          link,
          description,
          timestamp: startDate.getTime(),
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
        onClose();
      }
    } finally {
      setIsLoading(false);
    }
  }, [title, link, description, startDate]);

  const onSelectDate = useCallback((date) => {
    setStartDate(date);
  }, []);

  return (
    <>
      <Signer signerAccount={signerAccount} balanceName="Balance" />
      <Title setValue={setTitle} />
      <Description setValue={setDescription} />
      <StartDate
        value={startDate}
        onClick={() => setShowDateSelectModal(true)}
      />
      <Link setValue={setLink} />
      <ButtonWrapper>
        <SecondaryButton isLoading={isLoading} onClick={submit}>
          Submit
        </SecondaryButton>
      </ButtonWrapper>
      {showDateSelectModal && (
        <DateSelectModal
          onClose={() => setShowDateSelectModal(false)}
          defaultSelectedDate={startDate}
          onSelect={onSelectDate}
        />
      )}
    </>
  );
}

export default function CreateEventModal(props) {
  return (
    <PopupWithAddress
      title="Create Event"
      Component={PopupContent}
      {...props}
    />
  );
}
