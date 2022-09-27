import styled from "styled-components";
import { useEffect, useState } from "react";

import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import nextApi from "next-common/services/nextApi";
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";
import { fetchUserProfile } from "next-common/store/reducers/userSlice";
import NextHead from "next-common/components/nextHead";
import { isKeyRegisteredUser } from "next-common/utils";
import { useRouter } from "next/router";
import SecondaryButton from "next-common/components/buttons/secondaryButton";
import { PrimaryCard } from "next-common/components/styled/containers/primaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import Divider from "next-common/components/styled/layout/divider";
import SettingsLayout from "next-common/components/layout/settingsLayout";
import useDiscussionOptions from "components/setting/notification/useDiscussionOptions";
import useTreasuryOptions from "components/setting/notification/useTreasuryOptions";

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

export default withLoginUserRedux(({ loginUser, chain, unsubscribe }) => {
  const dispatch = useDispatch();
  const [saving, setSaving] = useState(false);
  const [showLoginToUnsubscribe, setShowLoginToUnsubscribe] = useState(false);

  const emailVerified =
    loginUser && isKeyRegisteredUser(loginUser) && !loginUser.emailVerified;
  const disabled = !loginUser || !loginUser.emailVerified;

  const {
    discussionOptionsComponent,
    getDiscussionOptionValues,
  } = useDiscussionOptions({
    disabled,
    saving,
    reply: !!loginUser?.notification?.reply,
    mention: !!loginUser?.notification?.mention,
  });

  const {
    treasuryOptionsComponent,
    getTreasuryOptionValues,
  } = useTreasuryOptions({
    disabled,
    saving,
    newTreasuryProposal: !!loginUser?.notification?.newTreasuryProposal,
    treasuryProposalApprove: !!loginUser?.notification?.treasuryProposalApprove,
    treasuryProposalAwardOrReject: !!loginUser?.notification?.treasuryProposalAwardOrReject,
    newTreasuryBounty: !!loginUser?.notification?.newTreasuryBounty,
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
      ...getDiscussionOptionValues(),
      ...getTreasuryOptionValues(),
    };

    const { result, error } = await nextApi.patch("user/notification", data);
    if (result) {
      dispatch(fetchUserProfile());
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
        <TitleContainer>Notification</TitleContainer>
        <ContentWrapper>
          {showLoginToUnsubscribe && (
            <WarningMessage>
              Please login to unsubscribe notifications
            </WarningMessage>
          )}
          {emailVerified && (
            <WarningMessage>
              Please set the email to receive notifications
            </WarningMessage>
          )}

          <Options>
            {discussionOptionsComponent}
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
