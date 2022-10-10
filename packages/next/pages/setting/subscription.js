import styled from "styled-components";
import { useEffect, useState } from "react";

import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import nextApi from "next-common/services/nextApi";
import { newErrorToast, newSuccessToast, } from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";
import NextHead from "next-common/components/nextHead";
import { isKeyRegisteredUser } from "next-common/utils";
import { useRouter } from "next/router";
import SecondaryButton from "next-common/components/buttons/secondaryButton";
import { PrimaryCard } from "next-common/components/styled/containers/primaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import Divider from "next-common/components/styled/layout/divider";
import SettingsLayout from "next-common/components/layout/settingsLayout";
import useTreasuryOptions from "components/setting/notification/useTreasuryOptions";
import { fetchAndUpdateUser, useUserDispatch } from "next-common/context/user";

const Wrapper = styled.div`
  max-width: 932px;
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

const ContentWrapper = styled(PrimaryCard)`
  font-size: 14px;

  input {
    background: ${(props) => props.theme.neutral};
    border-color: ${(props) => props.theme.grey300Border};
    color: ${(props) => props.theme.textPrimary};
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  > button {
    width: 80px;
  }
`;

const WarningMessage = styled.div`
  color: ${(props) => props.theme.secondaryRed500};
  background: ${(props) => props.theme.secondaryRed100};
  border-radius: 4px;
  padding: 12px 16px;
  font-size: 14px;
  line-height: 140%;
  margin-bottom: 16px;
`;

const Options = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Info = styled.div`
  display: flex;
  padding: 10px 16px;

  background: ${p => p.theme.grey100Bg};
  border-radius: 4px;

  font-weight: 400;
  font-size: 14px;
  line-height: 20px;

  color: ${p => p.theme.textSecondary};

  margin-bottom: 16px;
`;

export default withLoginUserRedux(({ loginUser, chain, unsubscribe }) => {
  const dispatch = useDispatch();
  const userDispatch = useUserDispatch();
  const [saving, setSaving] = useState(false);
  const [showLoginToUnsubscribe, setShowLoginToUnsubscribe] = useState(false);

  const emailVerified =
    loginUser && isKeyRegisteredUser(loginUser) && !loginUser.emailVerified;
  const disabled = !loginUser || !loginUser.emailVerified;

  const {
    treasuryOptionsComponent,
    getTreasuryOptionValues,
  } = useTreasuryOptions({
    disabled,
    saving,
    newTreasuryProposal: !!loginUser?.notification?.newTreasuryProposal,
    treasuryProposalApprove: !!loginUser?.notification?.treasuryProposalApprove,
    treasuryProposalAwardOrReject: !!loginUser?.notification?.treasuryProposalAwardOrReject,
  });

  const router = useRouter();

  useEffect(() => {
    if (unsubscribe) {
      if (loginUser === null) {
        setShowLoginToUnsubscribe(true);
      }
      return;
    }

    if (loginUser === null) {
      router.push("/login");
    }
  }, [loginUser, router, unsubscribe]);

  const updateNotificationSetting = async () => {
    if (saving) {
      return;
    }

    setSaving(true);

    const data = {
      ...getTreasuryOptionValues(),
    };

    const { result, error } = await nextApi.patch("user/notification", data);
    if (result) {
      await fetchAndUpdateUser(userDispatch);
      dispatch(newSuccessToast("Settings saved"));
    } else if (error) {
      dispatch(newErrorToast(error.message));
    }
    setSaving(false);
  };

  return (
    <SettingsLayout user={loginUser}>
      <NextHead title={`Settings`} desc={``} />
      <Wrapper>
        <TitleContainer>Subscription</TitleContainer>
        <ContentWrapper>
          {showLoginToUnsubscribe ? (
            <WarningMessage>
              Please login to unsubscribe notifications
            </WarningMessage>
          ) : (
            emailVerified ? (
              <WarningMessage>
                Please set the email to receive notifications
              </WarningMessage>
            ) : (
              <Info>
                Subscribe to messages to receive email from activity changes.
              </Info>
            )
          )}

          <Options>
            {treasuryOptionsComponent}
          </Options>

          <Divider margin={24} />
          <ButtonWrapper>
            <SecondaryButton
              disabled={disabled}
              onClick={updateNotificationSetting}
            >
              Save
            </SecondaryButton>
          </ButtonWrapper>
        </ContentWrapper>
      </Wrapper>
    </SettingsLayout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;
  const { unsubscribe } = context.query;

  return {
    props: {
      chain,
      unsubscribe: unsubscribe ?? null,
    },
  };
});
