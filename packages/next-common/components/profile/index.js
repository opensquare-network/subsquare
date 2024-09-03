import { useEffect } from "react";
import ListLayout from "next-common/components/layout/ListLayout";
import Bio from "./bio";
import useProfileTabs from "next-common/components/profile/tabs";
import ProfileBreadcrumbs from "next-common/components/profile/breadcrumbs";
import useProfileTabContent from "next-common/components/profile/tabs/content";
import useFetchProfileData from "next-common/components/profile/useFetchProfileData";
import { useDispatch } from "react-redux";
import { setProfileTransfers } from "next-common/store/reducers/profile/transfer";
import { setProfileIdentityTimeline } from "next-common/store/reducers/profile/identityTimeline";
import useProfileAddress from "./useProfileAddress";
import useSubFellowshipCoreMember from "next-common/hooks/fellowship/core/useSubFellowshipCoreMember";
import CollectivesProvider from "next-common/context/collectives/collectives";
import CollectivesMemberProvider from "next-common/context/collectives/member";

function ProfilePageImpl() {
  useFetchProfileData();

  const tabs = useProfileTabs();
  const tabContent = useProfileTabContent();

  return (
    <ListLayout
      header={
        <>
          <ProfileBreadcrumbs />
          <Bio />
        </>
      }
      tabs={tabs}
    >
      {tabContent}
    </ListLayout>
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
  const section = fellowshipMember
    ? "fellowship"
    : ambassadorMember
    ? "ambassador"
    : null;

  return (
    <CollectivesProvider section={section}>
      <CollectivesMemberProvider member={member}>
        <ProfilePageImpl />
      </CollectivesMemberProvider>
    </CollectivesProvider>
  );
}
