import { useTheme } from "styled-components";
import { cn } from "next-common/utils";
import { DisplayUserAvatar } from "../bio";
import { isPolkadotAddress } from "next-common/utils/viewfuncs";
import { isEthereumAddress } from "@polkadot/util-crypto";
import { usePageProps } from "next-common/context/page";
import { useIsMobile } from "next-common/components/overview/accountInfo/components/accountBalances";
import EditAvatarIconButton from "next-common/components/editAvatarIconButton";
import { useAvatarPermissionsContext } from "next-common/components/profile/header/context/avatarPermissionsContext";
import SecondaryButton from "next-common/lib/button/secondary";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import getStorageLink from "next-common/utils/env/storageLink";
import { useProfileUserInfoContext } from "next-common/components/profile/header/context/profileUserInfoContext";
import { STATICS_CDN_URL } from "next-common/utils/consts/statics";
import useIsAdmin from "next-common/hooks/useIsAdmin";
import nextApi from "next-common/services/nextApi";
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";
import Tooltip from "next-common/components/tooltip";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";

const ProfileBannerEditPopup = dynamicPopup(
  () => import("next-common/components/profileBannerEditPopup"),
  {
    ssr: false,
  },
);

const ProfileMutePopup = dynamicPopup(
  () => import("next-common/components/profileMutePopup"),
  {
    ssr: false,
  },
);

export function useProfileBannerUrlWithDefault() {
  const { isDark } = useTheme();
  const filename = `imgBannerProfile${isDark ? "Dark" : "Light"}.webp`;
  return `${STATICS_CDN_URL}/banner/${filename}`;
}

export function useProfileBannerUrl() {
  const { user } = useProfileUserInfoContext();
  const defaultBannerUrl = useProfileBannerUrlWithDefault();

  const bannerUrl = useMemo(() => {
    if (!user?.bannerCid) {
      return defaultBannerUrl;
    }

    return getStorageLink(user.bannerCid);
  }, [defaultBannerUrl, user]);

  return bannerUrl;
}

export default function ProfileHeaderWithBanner() {
  const isMobile = useIsMobile();
  const dispatch = useDispatch();
  const isAdmin = useIsAdmin();
  const { ensureLogin } = useEnsureLogin();
  const { user, id } = usePageProps();
  const { user: profileUser, fetch: fetchProfileUser } =
    useProfileUserInfoContext();
  const [isEditBannerPopupOpen, setIsEditBannerPopupOpen] = useState(false);
  const [isMutePopupOpen, setIsMutePopupOpen] = useState(false);
  const [muteState, setMuteState] = useState({});
  const { isSelf, isProxyAccount } = useAvatarPermissionsContext();
  const address =
    isPolkadotAddress(id) || isEthereumAddress(id) ? id : user?.address;
  const bannerUrl = useProfileBannerUrl();
  const isMuted =
    muteState.address === address
      ? !!muteState.muted
      : !!(profileUser?.isMuted ?? user?.isMuted);
  const muteTooltipContent = isMuted ? (
    <div>
      <div className="whitespace-nowrap">Cannot create discussions</div>
      <div className="whitespace-nowrap">Cannot create or edit comments</div>
      <div className="whitespace-nowrap">
        Cannot edit discussions or onchain proposals
      </div>
    </div>
  ) : null;
  const canMuteUser = isAdmin && !isSelf && !!address;

  const muteAddress = useCallback(async () => {
    if (!(await ensureLogin())) {
      return false;
    }

    const { error } = await nextApi.post(`users/${address}/mute`);
    if (error) {
      dispatch(newErrorToast(error.message));
      return false;
    }

    setMuteState({ address, muted: true });
    dispatch(newSuccessToast("The address is muted"));
    await fetchProfileUser();
    return true;
  }, [address, dispatch, ensureLogin, fetchProfileUser]);

  const unmuteAddress = useCallback(async () => {
    if (!(await ensureLogin())) {
      return false;
    }

    const { error } = await nextApi.delete(`users/${address}/mute`);
    if (error) {
      dispatch(newErrorToast(error.message));
      return false;
    }

    setMuteState({ address, muted: false });
    dispatch(newSuccessToast("The address is unmuted"));
    await fetchProfileUser();
    return true;
  }, [address, dispatch, ensureLogin, fetchProfileUser]);

  return (
    <div
      className={cn(
        "bg-no-repeat bg-cover bg-center",
        "w-full h-[120px] relative",
      )}
      style={{ backgroundImage: `url(${bannerUrl})` }}
    >
      <div
        className={cn(
          "px-12 mx-auto max-w-[1200px] max-sm:px-6 relative top-[72px] flex justify-between",
          isMobile && "flex justify-center",
        )}
      >
        <div className="w-[96px] h-[96px] rounded-[100px] border border-neutral300 bg-neutral100 relative">
          <DisplayUserAvatar address={address} size={94} />
          {(isSelf || isProxyAccount) && <EditAvatarIconButton />}
        </div>

        {(canMuteUser || isSelf || isProxyAccount) && (
          <div
            className={cn(
              "flex items-center gap-2 self-start -mt-[56px]",
              isMobile && "absolute right-6",
            )}
          >
            {canMuteUser && (
              <Tooltip content={muteTooltipContent}>
                <SecondaryButton
                  size="small"
                  onClick={() => setIsMutePopupOpen(true)}
                >
                  {isMuted ? "Unmute" : "Mute"}
                </SecondaryButton>
              </Tooltip>
            )}
            {(isSelf || isProxyAccount) && (
              <SecondaryButton
                size="small"
                onClick={() => setIsEditBannerPopupOpen(true)}
              >
                Edit Banner
              </SecondaryButton>
            )}
          </div>
        )}
      </div>
      {isEditBannerPopupOpen && (
        <ProfileBannerEditPopup
          onClose={() => setIsEditBannerPopupOpen(false)}
        />
      )}
      {isMutePopupOpen && (
        <ProfileMutePopup
          muted={isMuted}
          onClose={() => setIsMutePopupOpen(false)}
          onConfirm={isMuted ? unmuteAddress : muteAddress}
        />
      )}
    </div>
  );
}
