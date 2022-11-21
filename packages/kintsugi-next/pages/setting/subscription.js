import styled from "styled-components";
import { useEffect, useState } from "react";

import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import nextApi, { ssrNextApi } from "next-common/services/nextApi";
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";
import NextHead from "next-common/components/nextHead";
import { isKeyRegisteredUser } from "next-common/utils";
import { useRouter } from "next/router";
import SecondaryButton from "next-common/components/buttons/secondaryButton";
import { PrimaryCard } from "next-common/components/styled/containers/primaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import Divider from "next-common/components/styled/layout/divider";
import SettingsLayout from "next-common/components/layout/settingsLayout";
import useTreasuryProposalOptions from "next-common/components/setting/notification/useTreasuryProposalOptions";
import useTechCommMotionOptions from "next-common/components/setting/notification/useTechCommMotionOptions";
import useDemocracyProposalOptions from "next-common/components/setting/notification/useDemocracyProposalOptions";
import useDemocracyReferendumOptions from "next-common/components/setting/notification/useDemocracyReferendumOptions";
import Cookies from "cookies";
import {
  CACHE_KEY,
  pageHomeLayoutMainContentWidth,
} from "next-common/utils/constants";
import FoldableSections from "next-common/components/setting/notification/foldableSections";
import { Options } from "next-common/components/setting/notification/styled";

const Wrapper = styled.div`
  max-width: ${pageHomeLayoutMainContentWidth}px;
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

const Info = styled.div`
  display: flex;
  padding: 10px 16px;

  background: ${(p) => p.theme.grey100Bg};
  border-radius: 4px;

  font-weight: 400;
  font-size: 14px;
  line-height: 20px;

  color: ${(p) => p.theme.textSecondary};

  margin-bottom: 16px;
`;

export default withLoginUserRedux(
  ({ loginUser, subscription: _subscription, unsubscribe }) => {
    const dispatch = useDispatch();
    const [saving, setSaving] = useState(false);
    const [showLoginToUnsubscribe, setShowLoginToUnsubscribe] = useState(false);
    const [subscription, setSubscription] = useState(_subscription);

    const emailVerified =
      loginUser && isKeyRegisteredUser(loginUser) && !loginUser.emailVerified;
    const isVerifiedUser = loginUser?.emailVerified;

    const {
      treasuryProposalOptionsComponent,
      getTreasuryProposalOptionValues,
      isChanged: isTreasuryProposalOptionsChanged,
    } = useTreasuryProposalOptions({
      disabled: !isVerifiedUser,
      saving,
      treasuryProposalProposed: subscription?.treasuryProposalProposed,
      treasuryProposalApproved: subscription?.treasuryProposalApproved,
      treasuryProposalAwarded: subscription?.treasuryProposalAwarded,
      treasuryProposalRejected: subscription?.treasuryProposalRejected,
    });

    const {
      techCommMotionOptionsComponent,
      getTechCommMotionOptionValues,
      isChanged: isTechCommMotionOptionsChanged,
    } = useTechCommMotionOptions({
      isKintsugi: true,
      disabled: !isVerifiedUser,
      saving,
      tcMotionExecuted: subscription?.tcMotionExecuted,
    });

    const {
      democracyProposalOptionsComponent,
      getDemocracyProposalOptionValues,
      isChanged: isDemocracyProposalOptionsChanged,
    } = useDemocracyProposalOptions({
      disabled: !isVerifiedUser,
      saving,
      democracyProposalProposed: subscription?.democracyProposalProposed,
      democracyProposalCanceled: subscription?.democracyProposalCanceled,
    });

    const {
      democracyReferendumOptionsComponent,
      getDemocracyReferendumOptionValues,
      isChanged: isDemocracyReferendumOptionsChanged,
    } = useDemocracyReferendumOptions({
      isKintsugi: true,
      disabled: !isVerifiedUser,
      saving,
      democracyReferendumStarted: subscription?.democracyReferendumStarted,
      democracyReferendumPassed: subscription?.democracyReferendumPassed,
      democracyReferendumNotPassed: subscription?.democracyReferendumNotPassed,
      democracyReferendumCancelled: subscription?.democracyReferendumCancelled,
      democracyReferendumExecuted: subscription?.democracyReferendumExecuted,
      democracyReferendumNotExecuted:
        subscription?.democracyReferendumNotExecuted,
      democracyReferendumFastTrack: subscription?.democracyReferendumFastTrack,
    });

    const canSave =
      isVerifiedUser &&
      (isTreasuryProposalOptionsChanged ||
        isTechCommMotionOptionsChanged ||
        isDemocracyProposalOptionsChanged ||
        isDemocracyReferendumOptionsChanged);

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

    const fetchSubscriptionSetting = async () => {
      const { result } = await nextApi.fetch(`user/subscription`);
      if (result) {
        setSubscription(result);
      }
    };

    const updateNotificationSetting = async () => {
      if (saving) {
        return;
      }

      setSaving(true);

      const data = {
        ...getTreasuryProposalOptionValues(),
        ...getTechCommMotionOptionValues(),
        ...getDemocracyProposalOptionValues(),
        ...getDemocracyReferendumOptionValues(),
      };

      const { result, error } = await nextApi.patch("user/subscription", data);
      if (result) {
        dispatch(newSuccessToast("Settings saved"));
        await fetchSubscriptionSetting();
      } else if (error) {
        dispatch(newErrorToast(error.message));
      }
      setSaving(false);
    };

    return (
      <SettingsLayout>
        <NextHead title={`Settings`} desc={``} />
        <Wrapper>
          <TitleContainer>Subscription</TitleContainer>
          <ContentWrapper>
            {showLoginToUnsubscribe ? (
              <WarningMessage>
                Please login to unsubscribe notifications
              </WarningMessage>
            ) : emailVerified ? (
              <WarningMessage>
                Please set the email to receive notifications
              </WarningMessage>
            ) : (
              <Info>
                Subscribe to messages to receive email from activity changes.
              </Info>
            )}

            <Options>
              <FoldableSections title="Treasury">
                {treasuryProposalOptionsComponent}
              </FoldableSections>
              <FoldableSections title="Tech-Comm.">
                {techCommMotionOptionsComponent}
              </FoldableSections>
              <FoldableSections title="Democracy">
                {democracyProposalOptionsComponent}
                {democracyReferendumOptionsComponent}
              </FoldableSections>
            </Options>

            <Divider margin={24} />
            <ButtonWrapper>
              <SecondaryButton
                disabled={!canSave}
                onClick={updateNotificationSetting}
                isLoading={saving}
              >
                Save
              </SecondaryButton>
            </ButtonWrapper>
          </ContentWrapper>
        </Wrapper>
      </SettingsLayout>
    );
  }
);

export const getServerSideProps = withLoginUser(async (context) => {
  const { unsubscribe } = context.query;

  const cookies = new Cookies(context.req, context.res);
  const authToken = cookies.get(CACHE_KEY.authToken);
  let options = { credentials: true };
  if (authToken) {
    options = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
  }

  const { result: subscription } = await ssrNextApi.fetch(
    `user/subscription`,
    {},
    options
  );

  return {
    props: {
      subscription: subscription ?? null,
      unsubscribe: unsubscribe ?? null,
    },
  };
});
