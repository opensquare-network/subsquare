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
import Cookies from "cookies";
import {
  CACHE_KEY,
  pageHomeLayoutMainContentWidth,
} from "next-common/utils/constants";
import { Options } from "next-common/components/setting/notification/styled";
import {
  InfoMessage,
  WarningMessage,
} from "next-common/components/setting/styled";
import useAdvisoryCommitteeSubscription from "components/settings/subscription/useAdvisoryCommitteeSubscription";
import useOpenGovSubscription from "components/settings/subscription/useOpenGovSubscription";
import useTreasrySubscription from "components/settings/subscription/useTreasurySubscription";
import useDemocracySubscription from "components/settings/subscription/useDemocracySubscription";
import useCouncilSubscription from "components/settings/subscription/useCouncilSubscription";
import useTechCommSubscription from "components/settings/subscription/useTechCommSubscription";

const Wrapper = styled.div`
  max-width: ${pageHomeLayoutMainContentWidth}px;
  @media screen and (max-width: 1024px) {
    max-width: 960px;
  }
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
      treasuryOptions,
      isTreasuryOptionsChanged,
      getTreasuryOptionValues,
    } = useTreasrySubscription(subscription, saving, isVerifiedUser);

    const { councilOptions, isCouncilOptionsChanged, getCouncilOptionValues } =
      useCouncilSubscription(subscription, saving, isVerifiedUser);

    const {
      techCommOptions,
      isTechCommOptionsChanged,
      getTechCommOptionValues,
    } = useTechCommSubscription(subscription, saving, isVerifiedUser);

    const {
      democracyOptions,
      isDemocracyOptionsChanged,
      getDemocracyOptionValues,
    } = useDemocracySubscription(subscription, saving, isVerifiedUser);

    const { openGovOptions, isOpenGovOptionsChanged, getOpenGovOptionValues } =
      useOpenGovSubscription(subscription, saving, isVerifiedUser);

    const {
      advisoryOptions,
      isAdvisoryCommitteeOptionsChanged,
      getAdvisoryCommitteeOptionValues,
    } = useAdvisoryCommitteeSubscription(subscription, saving, isVerifiedUser);

    const canSave =
      isVerifiedUser &&
      (isTreasuryOptionsChanged ||
        isCouncilOptionsChanged ||
        isTechCommOptionsChanged ||
        isDemocracyOptionsChanged ||
        isOpenGovOptionsChanged ||
        isAdvisoryCommitteeOptionsChanged);

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
        ...getTechCommOptionValues(),
        ...getCouncilOptionValues(),
        ...getDemocracyOptionValues(),
        ...getTreasuryOptionValues(),
        ...getOpenGovOptionValues(),
        ...getAdvisoryCommitteeOptionValues(),
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
              <InfoMessage>
                Subscribe to messages to receive email from activity changes.
              </InfoMessage>
            )}

            <Options>
              {openGovOptions}
              {treasuryOptions}
              {councilOptions}
              {techCommOptions}
              {advisoryOptions}
              {democracyOptions}
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
