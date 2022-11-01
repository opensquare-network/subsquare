import styled from "styled-components";
import { useEffect, useState } from "react";

import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import nextApi, { ssrNextApi } from "next-common/services/nextApi";
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
import useTreasuryProposalOptions from "next-common/components/setting/notification/useTreasuryProposalOptions";
import useTreasuryTipOptions from "next-common/components/setting/notification/useTreasuryTipOptions";
import useCouncilMotionOptions from "next-common/components/setting/notification/useCouncilMotionOptions";
import useTreasuryBountyOptions from "next-common/components/setting/notification/useTreasuryBountyOptions";
import useTreasuryChildBountyOptions from "next-common/components/setting/notification/useTreasuryChildBountyOptions";
import Cookies from "cookies";
import { CACHE_KEY } from "next-common/utils/constants";
import { Label, Sections } from "next-common/components/setting/notification/styled";
import homeMenus from "next-common/utils/consts/menu";

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

function checkSubMenu(menus, menuName) {
  const chain = process.env.NEXT_PUBLIC_CHAIN;
  const menu = menus?.find(item => item.name === menuName);
  const hasMenu = menu && !menu.excludeToChains?.includes(chain);
  return { hasMenu, menu };
}

export default withLoginUserRedux(({ loginUser, chain, subscription: _subscription, unsubscribe }) => {
  const dispatch = useDispatch();
  const [saving, setSaving] = useState(false);
  const [showLoginToUnsubscribe, setShowLoginToUnsubscribe] = useState(false);
  const [subscription, setSubscription] = useState(_subscription);

  const { hasMenu: hasTreasury, menu: treasuryMenu } = checkSubMenu(homeMenus, "TREASURY");
  const { hasMenu: hasTreasuryProposal } = checkSubMenu(treasuryMenu?.items, "Proposals");
  const { hasMenu: hasTreasuryTip } = checkSubMenu(treasuryMenu?.items, "Tips");
  const { hasMenu: hasTreasuryBounty } = checkSubMenu(treasuryMenu?.items, "Bounties");
  const { hasMenu: hasTreasuryChildBounty } = checkSubMenu(treasuryMenu?.items, "Child Bounties");
  const { hasMenu: hasCouncil, menu: councilMenu } = checkSubMenu(homeMenus, "COUNCIL");
  const { hasMenu: hasCouncilMotion } = checkSubMenu(councilMenu?.items, "Motions");

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
    treasuryTipOptionsComponent,
    getTreasuryTipOptionValues,
    isChanged: isTreasuryTipOptionsChanged,
  } = useTreasuryTipOptions({
    disabled: !isVerifiedUser,
    saving,
    treasuryTipNew: subscription?.treasuryTipNew,
    treasuryTipTip: subscription?.treasuryTipTip,
    treasuryTipClosed: subscription?.treasuryTipClosed,
    treasuryTipRetracted: subscription?.treasuryTipRetracted
  });

  const {
    treasuryBountyOptionsComponent,
    getTreasuryBountyOptionValues,
    isChanged: isTreasuryBountyOptionsChanged,
  } = useTreasuryBountyOptions({
    disabled: !isVerifiedUser,
    saving,
    treasuryBountyProposed: subscription?.treasuryBountyProposed,
    treasuryBountyAwarded: subscription?.treasuryBountyAwarded,
    treasuryBountyApproved: subscription?.treasuryBountyApproved,
    treasuryBountyCanceled: subscription?.treasuryBountyCanceled,
    treasuryBountyClaimed: subscription?.treasuryBountyClaimed,
    treasuryBountyRejected: subscription?.treasuryBountyRejected,
  });

  const {
    treasuryChildBountyOptionsComponent,
    getTreasuryChildBountyOptionValues,
    isChanged: isTreasuryChildBountyOptionsChanged,
  } = useTreasuryChildBountyOptions({
    disabled: !isVerifiedUser,
    saving,
    treasuryChildBountyAdded: subscription?.treasuryChildBountyAdded,
    treasuryChildBountyAwarded: subscription?.treasuryChildBountyAwarded,
    treasuryChildBountyCanceled: subscription?.treasuryChildBountyCanceled,
    treasuryChildBountyClaimed: subscription?.treasuryChildBountyClaimed,
  });

  const {
    councilMotionOptionsComponent,
    getCouncilMotionOptionValues,
    isChanged: isCouncilMotionOptionsChanged,
  } = useCouncilMotionOptions({
    disabled: !isVerifiedUser,
    saving,
    councilMotionProposed: subscription?.councilMotionProposed,
    councilMotionVoted: subscription?.councilMotionVoted,
    councilMotionApproved: subscription?.councilMotionApproved,
    councilMotionDisApproved: subscription?.councilMotionDisApproved,
  });

  const canSave = isVerifiedUser && (
    isTreasuryProposalOptionsChanged ||
    isTreasuryTipOptionsChanged ||
    isCouncilMotionOptionsChanged ||
    isTreasuryBountyOptionsChanged ||
    isTreasuryChildBountyOptionsChanged
  );

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
  }

  const updateNotificationSetting = async () => {
    if (saving) {
      return;
    }

    setSaving(true);

    const data = {
      ...(hasTreasury && hasTreasuryProposal ? getTreasuryProposalOptionValues() : {}),
      ...(hasTreasury && hasTreasuryTip ? getTreasuryTipOptionValues() : {}),
      ...(hasTreasury && hasTreasuryBounty ? getTreasuryBountyOptionValues() : {}),
      ...(hasTreasury && hasTreasuryChildBounty ? getTreasuryChildBountyOptionValues() : {}),
      ...(hasCouncil && hasCouncilMotion ? getCouncilMotionOptionValues() : {}),
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

  let treasuryOptions = null;
  if (hasTreasury && (
    hasTreasuryProposal ||
    hasTreasuryTip ||
    hasTreasuryBounty ||
    hasTreasuryChildBounty
  )) {
    treasuryOptions = (
      <div>
        <Label>Treasury</Label>
        <Sections>
          {hasTreasuryProposal && treasuryProposalOptionsComponent}
          {hasTreasuryTip && treasuryTipOptionsComponent}
          {hasTreasuryBounty && treasuryBountyOptionsComponent}
          {hasTreasuryChildBounty && treasuryChildBountyOptionsComponent}
        </Sections>
      </div>
    );
  }

  let councilOptions = null;
  if (hasCouncil && hasCouncilMotion) {
    councilOptions = (
      <div>
        <Label>Council</Label>
        <Sections>
          {hasCouncilMotion && councilMotionOptionsComponent}
        </Sections>
      </div>
    );
  }

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
            {treasuryOptions}
            {councilOptions}
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
});

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

  const { result: subscription } = await ssrNextApi.fetch(`user/subscription`, {}, options);

  return {
    props: {
      chain,
      subscription: subscription ?? null,
      unsubscribe: unsubscribe ?? null,
    },
  };
});
