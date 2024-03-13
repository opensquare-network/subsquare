import React, { useEffect } from "react";
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

export default function ProfilePage() {
  const tabs = useProfileTabs();
  const tabContent = useProfileTabContent();
  useFetchProfileData();

  const address = useProfileAddress();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setProfileTransfers(null));
    dispatch(setProfileIdentityTimeline(null));
  }, [dispatch, address]);

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
