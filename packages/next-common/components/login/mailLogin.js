/* eslint-disable react/no-unescaped-entities */

import React, { useState } from "react";
import styled from "styled-components";
import nextApi from "next-common/services/nextApi";
import ErrorText from "next-common/components/ErrorText";
import { FormButtonsWrapper, FormInputsWrapper, FormWrapper } from "./styled";
import Username from "./username";
import Password from "./password";
import GhostButton from "next-common/components/buttons/ghostButton";
import PrimaryButton from "next-common/components/buttons/primaryButton";
import useForm from "next-common/utils/hooks/useForm";
import {
  fetchAndUpdateUserStatus,
  useSetUser,
  useUserContext,
} from "next-common/context/user";
import { useLoginPopup } from "next-common/hooks/useLoginPopup";
import Link from "next/link";
import { loginRedirectUrlSelector } from "next-common/store/reducers/userSlice";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const ForgetPassword = styled.div`
  margin-top: 8px;
  color: var(--textTertiary);
  font-size: 12px;
`;

export default function MailLogin({ setView }) {
  const [errors, setErrors] = useState();
  const [loading, setLoading] = useState(false);
  const setUser = useSetUser();
  const { closeLoginPopup } = useLoginPopup();
  const redirectUrl = useSelector(loginRedirectUrlSelector);
  const router = useRouter();
  const userContext = useUserContext();

  const { formData, handleInputChange, handleSubmit } = useForm(
    {
      usernameOrEmail: "",
      password: "",
    },
    async (formData) => {
      setLoading(true);
      const res = await nextApi.post("auth/login", formData);
      if (res.result) {
        setUser(res.result);
        fetchAndUpdateUserStatus(userContext);
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
          Connect with web3 address
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
