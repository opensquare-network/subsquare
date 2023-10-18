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
import {
  SettingSection,
  TitleContainer,
} from "next-common/components/styled/containers/titleContainer";
import Divider from "next-common/components/styled/layout/divider";
import SettingLayout from "next-common/components/layout/settingLayout";
import useDiscussionOptions from "next-common/components/setting/notification/useDiscussionOptions";
import {
  fetchAndUpdateUser,
  useUser,
  useUserDispatch,
} from "next-common/context/user";
import { CACHE_KEY } from "next-common/utils/constants";
import useSubscription from "components/settings/useSubscription";
import Cookies from "cookies";
import { ContentWrapper } from "next-common/components/setting/styled";
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

export default function Notification({ subscription }) {
  const loginUser = useUser();
  const dispatch = useDispatch();
  const userDispatch = useUserDispatch();
  const [saving, setSaving] = useState(false);

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

  const updateNotificationSetting = async () => {
    if (saving) {
      return;
    }

    setSaving(true);

    try {
      const data = {
        ...getDiscussionOptionValues(),
      };

      const { error } = await nextApi.patch("user/notification", data);
      if (error) {
        dispatch(newErrorToast(error.message));
        return;
      }

      if (isSubscriptionChanged) {
        const { error } = await updateSubscriptionSetting();
        if (error) {
          dispatch(newErrorToast(error.message));
          return;
        }
      }

      await fetchAndUpdateUser(userDispatch);

      dispatch(newSuccessToast("Settings updated"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <SettingLayout>
      <Channels />

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
}

export const getServerSideProps = withCommonProps(async (context) => {
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

  return {
    props: {
      chain,
      unsubscribe: unsubscribe ?? null,
      subscription: subscription ?? null,
    },
  };
});
