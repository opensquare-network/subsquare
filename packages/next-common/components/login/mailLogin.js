import React, { useState } from "react";
import styled from "styled-components";
import nextApi from "../../services/nextApi";
import ErrorText from "../ErrorText";
import { FormButtonsWrapper, FormInputsWrapper, FormWrapper } from "./styled";
import Username from "./username";
import Password from "./password";
import GhostButton from "../buttons/ghostButton";
import PrimaryButton from "../buttons/primaryButton";
import useForm from "../../utils/hooks/useForm";
import { updateUser, useUserDispatch } from "../../context/user";

const ForgetPassword = styled.div`
  margin-top: 8px;
  color: var(--textTertiary);
  font-size: 12px;
`;

export default function MailLogin({ setView, onClose }) {
  const [errors, setErrors] = useState();
  const [loading, setLoading] = useState(false);
  const userDispatch = useUserDispatch();

  const { formData, handleInputChange, handleSubmit } = useForm(
    {
      usernameOrEmail: "",
      password: "",
    },
    async (formData) => {
      setLoading(true);
      const res = await nextApi.post("auth/login", formData);
      if (res.result) {
        updateUser(res.result, userDispatch);
        onClose?.();
      } else if (res.error) {
        setErrors(res.error);
      }
      setLoading(false);
    },
    () => setErrors(null),
  );
  const { usernameOrEmail, password } = formData;

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <FormInputsWrapper>
        <Username
          value={usernameOrEmail}
          onChange={handleInputChange}
          error={errors?.data?.usernameOrEmail}
        />
        <Password
          value={password}
          onChange={handleInputChange}
          error={errors?.data?.password}
        />
        {errors?.message && !errors?.data && (
          <ErrorText>{errors?.message}</ErrorText>
        )}
        <ForgetPassword>
          <span
            className="cursor-pointer"
            onClick={() => {
              setView("forget");
            }}
          >
            Forget password?
          </span>
        </ForgetPassword>
      </FormInputsWrapper>
      <FormButtonsWrapper>
        <PrimaryButton isFill isLoading={loading} type="submit">
          Login
        </PrimaryButton>
        <GhostButton
          isFill
          onClick={(event) => {
            event.preventDefault();
            setView("web3");
          }}
        >
          Login with web3 address
        </GhostButton>
      </FormButtonsWrapper>
    </FormWrapper>
  );
}
