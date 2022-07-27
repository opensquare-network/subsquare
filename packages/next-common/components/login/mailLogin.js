import React, { useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { useForm } from "utils/hooks";
import nextApi from "../../services/nextApi";
import ErrorText from "../ErrorText";
import { setUser } from "../../store/reducers/userSlice";
import { FormButtonsWrapper, FormInputsWrapper, FormWrapper } from "./styled";
import Username from "./username";
import Password from "./password";
import GhostButton from "../buttons/ghostButton";
import SecondaryButton from "../buttons/secondaryButton";

const ForgetPassword = styled.div`
  margin-top: 8px;
  color: ${(props) => props.theme.textTertiary};
  font-size: 12px;
`;

export default function MailLogin({ setAddressLogin }) {
  const [errors, setErrors] = useState();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const { redirect } = router.query;

  const { formData, handleInputChange, handleSubmit } = useForm(
    {
      usernameOrEmail: "",
      password: "",
    },
    async (formData) => {
      setLoading(true);
      const res = await nextApi.post("auth/login", formData);
      if (res.result) {
        dispatch(setUser(res.result));
        router.replace(redirect || `/`);
      } else if (res.error) {
        setErrors(res.error);
      }
      setLoading(false);
    },
    () => setErrors(null)
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
          <Link href="/forget">Forget password?</Link>
        </ForgetPassword>
      </FormInputsWrapper>
      <FormButtonsWrapper>
        <SecondaryButton isFill isLoading={loading} type="submit">
          Login
        </SecondaryButton>
        <GhostButton isFill onClick={setAddressLogin}>
          Login with web3 address
        </GhostButton>
      </FormButtonsWrapper>
    </FormWrapper>
  );
}
