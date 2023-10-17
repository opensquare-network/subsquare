import styled from "styled-components";
import { useState } from "react";

import { withCommonProps } from "next-common/lib";
import nextApi, { ssrNextApi } from "next-common/services/nextApi";
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";
import PrimaryButton from "next-common/components/buttons/primaryButton";
import Divider from "next-common/components/styled/layout/divider";
import useDiscussionOptions from "next-common/components/setting/notification/useDiscussionOptions";
import {
  fetchAndUpdateUser,
  useUser,
  useUserDispatch,
} from "next-common/context/user";
import { ContentWrapper } from "next-common/components/setting/styled";
import SettingLayout from "next-common/components/layout/settingLayout";
import {
  SettingSection,
  TitleContainer,
} from "next-common/components/styled/containers/titleContainer";
import useSubscription from "components/settings/subscription/useSubscription";
import Cookies from "cookies";
import { CACHE_KEY } from "next-common/utils/constants";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import Channels from "next-common/components/setting/channels";

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  > button {
    width: 80px;
  }
`;

const Options = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export default function NotificationPage({ subscription, unsubscribe }) {
  const loginUser = useUser();
  const dispatch = useDispatch();
  const userDispatch = useUserDispatch();
  const [saving, setSaving] = useState(false);
  const user = loginUser;
  const {
    subscriptionComponent,
    isSubscriptionChanged,
    updateSubscriptionSetting,
  } = useSubscription({
    subscription,
  });

  const [isTelegramChannelOn, setIsTelegramChannelOn] = useState(
    user?.activeNotificationChannels?.telegram !== false,
  );
  const [isEmailChannelOn, setIsEmailChannelOn] = useState(
    user?.activeNotificationChannels?.email !== false,
  );
  const isActiveChannelsChanged =
    isTelegramChannelOn !==
      (user?.activeNotificationChannels?.telegram !== false) ||
    isEmailChannelOn !== (user?.activeNotificationChannels?.email !== false);

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

  const updateNotificationSetting = async () => {
    if (saving) {
      return;
    }

    setSaving(true);

    try {
      let error;

      ({ error } = await nextApi.patch("user/active-notification-channels", {
        email: !!isEmailChannelOn,
        telegram: !!isTelegramChannelOn,
      }));
      if (error) {
        dispatch(newErrorToast(error.message));
        return;
      }

      const data = {
        ...getDiscussionOptionValues(),
      };

      ({ error } = await nextApi.patch("user/notification", data));
      if (error) {
        dispatch(newErrorToast(error.message));
        return;
      }

      await fetchAndUpdateUser(userDispatch);

      if (isSubscriptionChanged) {
        const { error } = await updateSubscriptionSetting();
        if (error) {
          dispatch(newErrorToast(error.message));
          return;
        }
      }

      dispatch(newSuccessToast("Settings updated"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <SettingLayout>
      <Channels
        unsubscribe={unsubscribe}
        isEmailChannelOn={isEmailChannelOn}
        setIsEmailChannelOn={setIsEmailChannelOn}
        isTelegramChannelOn={isTelegramChannelOn}
        setIsTelegramChannelOn={setIsTelegramChannelOn}
      />

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
                (!isNotificationChanged &&
                  !isSubscriptionChanged &&
                  !isActiveChannelsChanged)
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
}

export const getServerSideProps = withCommonProps(async (context) => {
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
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      subscription: subscription ?? null,
      unsubscribe: unsubscribe ?? null,
      ...tracksProps,
    },
  };
});
