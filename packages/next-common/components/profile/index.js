import { useEffect } from "react";
import Bio from "./bio";
import useProfileTabs from "next-common/components/profile/tabs";
import useProfileTabContent from "next-common/components/profile/tabs/content";
import useFetchProfileData from "next-common/components/profile/useFetchProfileData";
import { useDispatch } from "react-redux";
import { setProfileTransfers } from "next-common/store/reducers/profile/transfer";
import { setProfileIdentityTimeline } from "next-common/store/reducers/profile/identityTimeline";
import useProfileAddress from "./useProfileAddress";
import ProfileHeaderWithBanner from "./header";
import ProfileLayout from "next-common/components/layout/ProfileLayout";
import WindowSizeProvider from "next-common/context/windowSize";
import AvatarPermissionsProvider from "./header/context/avatarPermissionsContext";
import ProfileUserInfoProvider from "./header/context/profileUserInfoContext";
import ProfileMultisigsActiveProvider from "next-common/components/profile/multisigs/context/profileMultisigsActiveContext";
import NoData from "../noData";

function ProfilePageImpl() {
  useFetchProfileData();
  const address = useProfileAddress();

  const tabs = useProfileTabs();
  const tabContent = useProfileTabContent();

  return (
    <AvatarPermissionsProvider>
      <ProfileUserInfoProvider>
        <ProfileLayout
          pageHeader={<ProfileHeaderWithBanner />}
          header={
            <>
              <Bio />
            </>
          }
          tabs={tabs}
        >
          {address ? tabContent : <NoData text="No profile data" />}
        </ProfileLayout>
      </ProfileUserInfoProvider>
    </AvatarPermissionsProvider>
  );
}

export default function ProfilePage() {
  const address = useProfileAddress();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setProfileTransfers(null));
    dispatch(setProfileIdentityTimeline(null));
  }, [dispatch, address]);
  return (
    <ProfileMultisigsActiveProvider>
      <WindowSizeProvider>
        <ProfilePageImpl />
      </WindowSizeProvider>
    </ProfileMultisigsActiveProvider>
  );
}
