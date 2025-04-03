import { useEffect } from "react";
import Bio from "./bio";
import useProfileTabs from "next-common/components/profile/tabs";
import useProfileTabContent from "next-common/components/profile/tabs/content";
import useFetchProfileData from "next-common/components/profile/useFetchProfileData";
import { useDispatch } from "react-redux";
import { setProfileTransfers } from "next-common/store/reducers/profile/transfer";
import { setProfileIdentityTimeline } from "next-common/store/reducers/profile/identityTimeline";
import useProfileAddress from "./useProfileAddress";
import useSubFellowshipCoreMember from "next-common/hooks/fellowship/core/useSubFellowshipCoreMember";
import CollectivesMemberProvider from "next-common/context/collectives/member";
import ProfileHeaderWithBanner from "./header";
import ProfileLayout from "next-common/components/layout/ProfileLayout";
import WindowSizeProvider from "next-common/context/windowSize";

function ProfilePageImpl() {
  useFetchProfileData();

  const tabs = useProfileTabs();
  const tabContent = useProfileTabContent();

  return (
    <ProfileLayout
      pageHeader={<ProfileHeaderWithBanner />}
      header={
        <>
          <Bio />
        </>
      }
      tabs={tabs}
    >
      {tabContent}
    </ProfileLayout>
  );
}

export default function ProfilePage() {
  const address = useProfileAddress();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setProfileTransfers(null));
    dispatch(setProfileIdentityTimeline(null));
  }, [dispatch, address]);

  const { member: fellowshipMember } = useSubFellowshipCoreMember(address);
  const { member: ambassadorMember } = useSubFellowshipCoreMember(
    address,
    "ambassadorCore",
  );
  const member = fellowshipMember || ambassadorMember || null;

  return (
    <CollectivesMemberProvider member={member}>
      <WindowSizeProvider>
        <ProfilePageImpl />
      </WindowSizeProvider>
    </CollectivesMemberProvider>
  );
}
