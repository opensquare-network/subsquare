import styled from "styled-components";
import { useEffect, useState } from "react";

import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import nextApi, { ssrNextApi } from "next-common/services/nextApi";
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";
import { isKeyRegisteredUser } from "next-common/utils";
import { useRouter } from "next/router";
import PrimaryButton from "next-common/components/buttons/primaryButton";
import {
  SettingSection,
  TitleContainer,
} from "next-common/components/styled/containers/titleContainer";
import Divider from "next-common/components/styled/layout/divider";
import SettingLayout from "next-common/components/layout/settingLayout";
import useDiscussionOptions from "next-common/components/setting/notification/useDiscussionOptions";
import { fetchAndUpdateUser, useUserDispatch } from "next-common/context/user";
import { CACHE_KEY } from "next-common/utils/constants";
import useSubscription from "components/settings/useSubscription";
import Cookies from "cookies";
import NotificationEmail from "next-common/components/setting/notificationEmail";
import { ContentWrapper } from "next-common/components/setting/styled";
import { fellowshipTracksApi, gov2TracksApi } from "next-common/services/url";

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  > button {
    width: 80px;
  }
`;

const WarningMessage = styled.div`
  color: var(--red500);
  background: var(--red100);
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

export default withLoginUserRedux(
  ({ loginUser, unsubscribe, subscription }) => {
    const isKeyUser = loginUser && isKeyRegisteredUser(loginUser);
    const dispatch = useDispatch();
    const userDispatch = useUserDispatch();
    const [saving, setSaving] = useState(false);
    const [showLoginToUnsubscribe, setShowLoginToUnsubscribe] = useState(false);
    const user = loginUser;

    const emailVerified =
      loginUser && isKeyRegisteredUser(loginUser) && !loginUser.emailVerified;
    const isVerifiedUser = loginUser?.emailVerified;

    const {
      discussionOptionsComponent,
      getDiscussionOptionValues,
      isChanged: isNotificationChanged,
    } = useDiscussionOptions({
      disabled: !isVerifiedUser,
      saving,
      reply: !!loginUser?.notification?.reply,
      mention: !!loginUser?.notification?.mention,
    });

    const {
      subscriptionComponent,
      isSubscriptionChanged,
      updateSubscriptionSetting,
    } = useSubscription({
      subscription,
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
        router.push("/");
      }
    }, [loginUser, router, unsubscribe]);

    const updateNotificationSetting = async () => {
      if (saving) {
        return;
      }

      setSaving(true);

      const data = {
        ...getDiscussionOptionValues(),
      };

      const { result, error } = await nextApi.patch("user/notification", data);
      if (result) {
        await fetchAndUpdateUser(userDispatch);

        if (isSubscriptionChanged) {
          const { result, error } = await updateSubscriptionSetting();
          if (result) {
            dispatch(newSuccessToast("Settings updated"));
          }
          if (error) {
            dispatch(newErrorToast(error.message));
          }
        }
      } else if (error) {
        dispatch(newErrorToast(error.message));
      }
      setSaving(false);
    };

    return (
      <SettingLayout>
        {isKeyUser && (
          <SettingSection>
            <TitleContainer>Email</TitleContainer>
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
              <NotificationEmail
                email={user?.email}
                verified={user?.emailVerified}
              />
            </ContentWrapper>
          </SettingSection>
        )}

        <SettingSection>
          <TitleContainer>Notification Settings</TitleContainer>
          <ContentWrapper>
            <Options>{discussionOptionsComponent}</Options>

            <Divider margin={24} />
            {subscriptionComponent}
            <Divider margin={24} />
            <ButtonWrapper>
              <PrimaryButton
                disabled={
                  !isVerifiedUser ||
                  (!isNotificationChanged && !isSubscriptionChanged)
                }
                onClick={updateNotificationSetting}
                isLoading={saving}
              >
                Save
              </PrimaryButton>
            </ButtonWrapper>
          </ContentWrapper>
        </SettingSection>
      </SettingLayout>
    );
  },
);

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;
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
    "user/subscription",
    {},
    options,
  );

  const [{ result: tracks }, { result: fellowshipTracks }] = await Promise.all([
    ssrNextApi.fetch(gov2TracksApi),
    ssrNextApi.fetch(fellowshipTracksApi),
  ]);

  return {
    props: {
      chain,
      unsubscribe: unsubscribe ?? null,
      subscription: subscription ?? null,
      tracks: tracks ?? [],
      fellowshipTracks: fellowshipTracks ?? [],
    },
  };
});
