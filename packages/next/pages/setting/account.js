import { useState } from "react";
import { useSelector } from "react-redux";
import Button from "next-common/components/button";
import DeleteAccount from "components/deleteAccount";
import Menu from "next-common/components/menu";
import { settingMenu } from "next-common/utils/constants";
import { userSelector } from "next-common/store/reducers/userSlice";
import { withLoginUser, withLoginUserRedux } from "lib";
import Layout from "components/layout";
import NextHead from "next-common/components/nextHead";
import {
  Wrapper,
  Title,
  ContentWrapper,
  Label,
  Divider,
  ButtonWrapper,
} from "components/setting/styled";
import Username from "components/setting/username";
import Email from "components/setting/email";
import Password from "components/setting/password";
import Logout from "components/setting/logout";

export default withLoginUserRedux(({ loginUser, chain }) => {
  const user = useSelector(userSelector);
  const [show, setShow] = useState(false);

  return (
    <>
      <Layout chain={chain} user={loginUser} left={<Menu menu={settingMenu} />}>
        <NextHead title={`Settings`} desc={``} />
        <Wrapper>
          <Title>Account</Title>
          <ContentWrapper>
            <Username username={user?.username} />
            <Divider />
            <Email email={user?.email} verified={user?.emailVerified} />
            <Divider />
            <Password />
            <Divider />
            <Logout />
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
