/* eslint-disable react/no-unescaped-entities */

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
import { useLoginPopup } from "next-common/hooks/useLoginPopup";
import Link from "next/link";
import { useRouter } from "next/router";
import { loginRedirectUrlSelector } from "next-common/store/reducers/userSlice";
import { useSelector } from "react-redux";

const ForgetPassword = styled.div`
  margin-top: 8px;
  color: var(--textTertiary);
  font-size: 12px;
`;

export default function MailLogin({ setView }) {
  const [errors, setErrors] = useState();
  const [loading, setLoading] = useState(false);
  const userDispatch = useUserDispatch();
  const { closeLoginPopup } = useLoginPopup();
  const router = useRouter();
  const redirectUrl = useSelector(loginRedirectUrlSelector);

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
        closeLoginPopup();
        if (redirectUrl) {
          router.push(redirectUrl);
        }
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
          <Link href={"/forget"}>Forget password?</Link>
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

      <div className="text-center text14Medium text-textSecondary">
        Don't have an account?{" "}
        <Link href={"/signup"} className="text-theme500">
          Sign up
        </Link>
      </div>
    </FormWrapper>
  );
}
