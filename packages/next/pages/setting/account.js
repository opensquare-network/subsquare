import styled from "styled-components";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Input from "components/input";
import Button from "next-common/components/button";
import DeleteAccount from "components/deleteAccount";
import Menu from "components/menu";
import { settingMenu } from "next-common/utils/constants";
import { userSelector, logout } from "store/reducers/userSlice";
import { useForm, useAuthPage } from "utils/hooks";
import ErrorText from "next-common/components/ErrorText";
import nextApi from "services/nextApi";
import { addToast } from "store/reducers/toastSlice";
import { withLoginUser, withLoginUserRedux } from "lib";
import Layout from "components/layout";
import { shadow_100 } from "styles/componentCss";
import NextHead from "../../components/nextHead";

const Wrapper = styled.div`
  max-width: 848px;
  @media screen and (max-width: 1024px) {
    max-width: 960px;
  }
  margin: auto;
  @media screen and (min-width: 1080px) {
    padding-bottom: 16px;
  }
  > :not(:first-child) {
    margin-top: 16px;
  }
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 16px;
`;

const ContentWrapper = styled.div`
  background: #ffffff;
  border: 1px solid #ebeef4;
  ${shadow_100};
  border-radius: 4px;
  padding: 48px;
  @media screen and (max-width: 768px) {
    padding: 24px;
  }
`;

const Label = styled.div`
  margin-bottom: 8px;
  font-weight: bold;
  font-size: 12px;
  :not(:first-child) {
    margin-top: 16px;
  }
`;

const InputWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  > :first-child {
    flex-grow: 1;
  }
  > :only-child {
    margin-right: 96px;
  }
  > :not(:only-child):last-child {
    width: 80px;
    margin-left: 16px;
  }
  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    > :only-child {
      margin-right: 0;
    }
    > :not(:only-child):last-child {
      margin-left: 0;
      margin-top: 8px;
    }
  }
`;

const Divider = styled.div`
  background: #ebeef4;
  height: 1px;
  margin: 24px 0;
`;

const EmailVerify = styled.div`
  display: flex;
  align-items: center;
  color: #9da9bb;
  height: 38px;
  padding-right: 16px;
  font-size: 14px;
  > img {
    width: 14px;
    height: 14px;
    margin-right: 8px;
  }
`;

const ButtonWrapper = styled.div`
  max-width: 240px;
`;

export default withLoginUserRedux(({ loginUser, chain }) => {
  useAuthPage(true);
  const user = useSelector(userSelector);
  const [show, setShow] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [changeLoading, setChangLoading] = useState(false);
  const [resendErrors, setResendErrors] = useState();
  const [changeErrors, setChangeErrors] = useState();
  const dispatch = useDispatch();
  const router = useRouter();

  const { formData, handleInputChange, handleSubmit, reset } = useForm(
    {
      oldPassword: "",
      newPassword: "",
    },
    async (formData) => {
      setChangLoading(true);
      const res = await nextApi.post("user/changepassword", formData);
      if (res.result) {
        dispatch(
          addToast({
            type: "success",
            message: "Change password successfully!",
          })
        );
        reset();
      } else if (res.error) {
        setChangeErrors(res.error);
      }
      setChangLoading(false);
    }
  );
  const { oldPassword, newPassword } = formData;

  const onResend = async () => {
    setResendLoading(true);
    const res = await nextApi.post("user/resendverifyemail");
    if (res.result) {
      dispatch(
        addToast({
          type: "success",
          message: "Resend email successfully!",
        })
      );
    } else if (res.error) {
      setResendErrors(res.error);
    }
    setResendLoading(false);
  };

  return (
    <>
      <Layout chain={chain} user={loginUser} left={<Menu menu={settingMenu} />}>
        <NextHead title={`Settings`} desc={``} />
        <Wrapper>
          <Title>Account</Title>
          <ContentWrapper>
            <div>
              <Label>Username</Label>
              <InputWrapper>
                <Input defaultValue={user?.username} disabled />
              </InputWrapper>
            </div>
            <Divider />
            <div>
              <Label>Email</Label>
              <InputWrapper>
                <Input
                  defaultValue={user?.email}
                  disabled
                  post={
                    user?.emailVerified ? (
                      <EmailVerify>
                        <img alt="" src="/imgs/icons/circle-check.svg" />
                        <div>Verified</div>
                      </EmailVerify>
                    ) : (
                      <EmailVerify>
                        <img alt="" src="/imgs/icons/circle-warning.svg" />
                        <div>Unverified</div>
                      </EmailVerify>
                    )
                  }
                />
                {!user?.emailVerified && (
                  <Button
                    secondary
                    onClick={onResend}
                    isLoading={resendLoading}
                  >
                    Resend
                  </Button>
                )}
              </InputWrapper>
              {resendErrors?.message && !resendErrors?.data && (
                <ErrorText>{resendErrors?.message}</ErrorText>
              )}
            </div>
            <Divider />
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
            <Divider />
            <div>
              <Label>Logout</Label>
              <ButtonWrapper>
                <Button
                  isFill
                  onClick={() => {
                    dispatch(logout());
                    router.replace("/");
                  }}
                >
                  Logout my account
                </Button>
              </ButtonWrapper>
            </div>
            <Divider />
            <div>
              <Label>Delete account</Label>
              <ButtonWrapper>
                <Button isFill danger onClick={() => setShow(true)}>
                  Delete my account
                </Button>
              </ButtonWrapper>
            </div>
          </ContentWrapper>
        </Wrapper>
      </Layout>
      {show && <DeleteAccount onClose={() => setShow(false)} />}
    </>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  return {
    props: {
      chain,
    },
  };
});
