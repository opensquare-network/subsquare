import { useState } from "react";
import { useDispatch } from "react-redux";
import Input from "next-common/components/input";
import Button from "next-common/components/button";
import { useForm } from "utils/hooks";
import ErrorText from "next-common/components/ErrorText";
import nextApi from "next-common/services/nextApi";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import {
  Label,
  InputWrapper,
} from "components/setting/styled";

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
