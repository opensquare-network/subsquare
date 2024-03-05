import React from "react";
import ListLayout from "next-common/components/layout/ListLayout";
import Bio from "./bio";
import useProfileTabs from "next-common/components/profile/tabs";
import ProfileBreadcrumbs from "next-common/components/profile/breadcrumbs";
import useProfileTabContent from "next-common/components/profile/tabs/content";
import useFetchProfileData from "next-common/components/profile/useFetchProfileData";
import { usePageProps } from "next-common/context/page";

export default function ProfilePage() {
  const { id } = usePageProps();
  const tabs = useProfileTabs();
  const tabContent = useProfileTabContent();
  useFetchProfileData();

  return (
    <ListLayout
      header={
        <>
          <ProfileBreadcrumbs id={id} />
          <Bio />
        </>
      }
      tabs={tabs}
    >
      {tabContent}
    </ListLayout>
  );
}
