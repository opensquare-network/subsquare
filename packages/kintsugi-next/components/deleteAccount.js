import styled from "styled-components";
import { useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import nextApi from "services/nextApi";

import Input from "./input";
import Button from "./button";
import { useForm } from "utils/hooks";
import { logout } from "store/reducers/userSlice";
import ErrorText from "components/errorText";

const Wrapper = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.24);
  z-index: 999;
  top: 0;
`;

const ContentWrapper = styled.div`
  background: #ffffff;
  border: 1px solid #ebeef4;
  box-shadow: 0 6px 7px rgba(30, 33, 52, 0.02),
    0 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),
    0 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786);
  border-radius: 6px;
  padding: 24px;
  width: 400px;
  margin: 122px auto 0;
  > :not(:first-child) {
    margin-top: 16px;
  }
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 14px;
  text-align: left;
`;

const InfoWrapper = styled.div`
  padding: 12px 16px;
  background: #fff1f0;
  border-radius: 4px;
  line-height: 150%;
  color: #f44336;
  font-size: 14px;
`;

const Label = styled.div`
  font-weight: bold;
  font-size: 12px;
  margin-bottom: 8px;
  text-align: left;
`;

const FormWrapper = styled.form`
  > :not(:first-child) {
    margin-top: 16px;
  }
  text-align: right;
  input {
    text-align: left;
  }
`;

export default function DeleteAccount({ onClose }) {
  const [errors, setErrors] = useState();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const { formData, handleInputChange, handleSubmit } = useForm(
    {
      password: "",
    },
    async (formData) => {
      setLoading(true);
      const res = await nextApi.post("user/deleteaccount", formData);
      if (res.result) {
        dispatch(logout());
        router.replace("/");
      } else if (res.error) {
        setErrors(res.error);
      }
      setLoading(false);
    },
    () => setErrors(null)
  );
  const { password } = formData;

  return (
    <Wrapper onClick={() => onClose()}>
      <ContentWrapper onClick={(event) => event.stopPropagation()}>
        <Title>Delete Account</Title>
        <InfoWrapper>
          Once you delete your account, there is no going back. Please be
          certain.
        </InfoWrapper>
        <FormWrapper onSubmit={handleSubmit}>
          <div>
            <Label>Password</Label>
            <Input
              placeholder="Please fill password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => {
                handleInputChange(e);
              }}
              error={errors?.data?.password}
            />
            {errors?.message && !errors?.data && (
              <ErrorText>{errors?.message}</ErrorText>
            )}
          </div>
          <Button danger isFill={false} type="submit" isLoading={loading}>
            Delete
          </Button>
        </FormWrapper>
      </ContentWrapper>
    </Wrapper>
  );
}
