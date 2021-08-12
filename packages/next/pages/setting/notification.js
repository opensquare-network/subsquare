import styled from "styled-components";

import Layout from "components/layout";
import Toggle from "components/toggle";
import Button from "components/button";
import Menu from "components/menu";
import { settingMenu } from "utils/constants";
import { useAuthPage } from "utils/hooks";
import {withLoginUser, withLoginUserRedux} from "../../lib";

const Wrapper = styled.div`
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
  box-shadow: 0px 6px 7px rgba(30, 33, 52, 0.02),
    0px 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),
    0px 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786);
  border-radius: 4px;
  padding: 48px;
  @media screen and (max-width: 600px) {
    padding: 24px;
  }
`;

const Lable = styled.div`
  font-weight: bold;
  margin-bottom: 16px;
`;

const ToggleItem = styled.div`
  display: flex;
  align-items: center;
  line-height: 150%;
  padding: 8px 0;
  > :first-child {
    flex-grow: 1;
  }
  > :last-child {
    flex: 0 0 auto;
    margin-left: 16px;
  }
`;

const Divider = styled.div`
  background: #ebeef4;
  height: 1px;
  margin: 24px 0;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  > button {
    width: 80px;
  }
`;

export default withLoginUserRedux(({
  loginUser,
}) => {
  useAuthPage(true);

  return (
    <Layout user={loginUser} left={<Menu menu={settingMenu} />}>
      <Wrapper>
        <Title>Notification</Title>
        <ContentWrapper>
          <div>
            <Lable>Email</Lable>
            <ToggleItem>
              <div>Notify me about comments on my posts</div>
              <Toggle />
            </ToggleItem>
            <ToggleItem>
              <div>Notify me about replies to my comments</div>
              <Toggle />
            </ToggleItem>
            <ToggleItem>
              <div>Notify me about mentions</div>
              <Toggle />
            </ToggleItem>
            <ToggleItem>
              <div>Notify me about supports on my comments</div>
              <Toggle />
            </ToggleItem>
          </div>
          <Divider />
          <ButtonWrapper>
            <Button secondary>Save</Button>
          </ButtonWrapper>
        </ContentWrapper>
      </Wrapper>
    </Layout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  return {
    props: {
    },
  };
});
