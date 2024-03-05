import React from "react";
import ListLayout from "next-common/components/layout/ListLayout";
import Bio from "./bio";
import useProfileTabs from "next-common/components/profile/tabs";
import ProfileBreadcrumbs from "next-common/components/profile/breadcrumbs";
import useProfileTabContent from "next-common/components/profile/tabs/content";
import useFetchProfileData from "next-common/components/profile/useFetchProfileData";

export default function ProfilePage() {
  const tabs = useProfileTabs();
  const tabContent = useProfileTabContent();
  useFetchProfileData();

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
