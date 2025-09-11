import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Input from "next-common/lib/input";
import ErrorText from "../ErrorText";
import nextApi from "../../services/nextApi";
import { newSuccessToast } from "../../store/reducers/toastSlice";
import { InputWrapper } from "./styled";
import PrimaryButton from "next-common/lib/button/primary";
import useForm from "../../utils/hooks/useForm";
import styled from "styled-components";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 9px;
`;

export default function Password() {
  const dispatch = useDispatch();
  const [changeLoading, setChangLoading] = useState(false);
  const [changeErrors, setChangeErrors] = useState();

  const { formData, handleInputChange, handleSubmit, reset } = useForm(
    {
      oldPassword: "",
      newPassword: "",
    },
    async (formData) => {
      setChangLoading(true);
      const res = await nextApi.post("user/changepassword", formData);
      if (res.result) {
        dispatch(newSuccessToast("Change password successfully!"));
        reset();
      } else if (res.error) {
        setChangeErrors(res.error);
      }
      setChangLoading(false);
    },
  );
  const { oldPassword, newPassword } = formData;

  return (
    <Form onSubmit={handleSubmit}>
      <InputWrapper>
        <Input
          placeholder="Please fill current password"
          type="password"
          name="oldPassword"
          value={oldPassword}
          onChange={(e) => {
            handleInputChange(e);
            setChangeErrors(null);
          }}
          error={changeErrors?.data?.oldPassword}
        />
      </InputWrapper>
      <InputWrapper>
        <Input
          placeholder="Please fill new password"
          type="password"
          name="newPassword"
          value={newPassword}
          onChange={(e) => {
            handleInputChange(e);
            setChangeErrors(null);
          }}
          error={changeErrors?.data?.newPassword}
        />
      </InputWrapper>
      {changeErrors?.message && !changeErrors?.data && (
        <ErrorText>{changeErrors?.message}</ErrorText>
      )}
      <PrimaryButton
        style={{ width: 72, height: 40 }}
        type="submit"
        loading={changeLoading}
      >
        Change
      </PrimaryButton>
    </Form>
  );
}
