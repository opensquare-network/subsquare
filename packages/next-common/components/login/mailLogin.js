/* eslint-disable react/no-unescaped-entities */

import { useState } from "react";
import styled from "styled-components";
import nextApi from "next-common/services/nextApi";
import ErrorText from "next-common/components/ErrorText";
import { FormButtonsWrapper, FormInputsWrapper, FormWrapper } from "./styled";
import Username from "./username";
import Password from "./password";
import SecondaryButton from "next-common/lib/button/secondary";
import PrimaryButton from "next-common/lib/button/primary";
import useForm from "next-common/utils/hooks/useForm";
import {
  fetchAndUpdateUserStatus,
  useSetUser,
  useUserContext,
} from "next-common/context/user";
import { useLoginPopup } from "next-common/hooks/useLoginPopup";
import Link from "next/link";
import { useDispatch } from "react-redux";
import {
  LoginResult,
  setLoginResult,
} from "next-common/store/reducers/userSlice";
import { setConnectPopupView } from "next-common/store/reducers/connectPopupSlice";
import isEvmChain from "next-common/utils/isEvmChain";
import { CONNECT_POPUP_DEFAULT_VIEW } from "next-common/utils/constants";

const ForgetPassword = styled.div`
  margin-top: 8px;
  color: var(--textTertiary);
  font-size: 12px;
`;

export default function MailLogin() {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState();
  const [loading, setLoading] = useState(false);
  const setUser = useSetUser();
  const { closeLoginPopup } = useLoginPopup();
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
        await fetchAndUpdateUserStatus(userContext);
        dispatch(setLoginResult(LoginResult.LoggedIn));
        closeLoginPopup();
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
        <PrimaryButton className="w-full" loading={loading} type="submit">
          Login
        </PrimaryButton>
        <SecondaryButton
          className="w-full"
          onClick={(event) => {
            event.preventDefault();
            dispatch(setConnectPopupView(CONNECT_POPUP_DEFAULT_VIEW));
          }}
        >
          Connect with {isEvmChain() ? "EVM" : "web3"} address
        </SecondaryButton>
      </FormButtonsWrapper>
    </FormWrapper>
  );
}
