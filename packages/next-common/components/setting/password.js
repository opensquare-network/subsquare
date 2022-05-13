import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Input from "../input";
import Button from "../button";
import { useForm } from "utils/hooks";
import ErrorText from "../ErrorText";
import nextApi from "../../services/nextApi";
import { newSuccessToast } from "../../store/reducers/toastSlice";
import {
  Label,
  InputWrapper,
} from "./styled";

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
    }
  );
  const { oldPassword, newPassword } = formData;

  return (
    <form onSubmit={handleSubmit}>
      <Label>Current password</Label>
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
      <Label>New password</Label>
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
        <Button secondary typt="submit" isLoading={changeLoading}>
          Change
        </Button>
      </InputWrapper>
      {changeErrors?.message && !changeErrors?.data && (
        <ErrorText>{changeErrors?.message}</ErrorText>
      )}
    </form>
  );
}
