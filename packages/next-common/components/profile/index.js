import React from "react";
import ListLayout from "next-common/components/layout/ListLayout";
import { isEthereumAddress } from "@polkadot/util-crypto";
import { isPolkadotAddress } from "../../utils/viewfuncs";
import Bio from "./bio";
import useProfileTabs from "next-common/components/profile/tabs";
import ProfileBreadcrumbs from "next-common/components/profile/breadcrumbs";
import useProfileTabContent from "next-common/components/profile/tabs/content";

export default function ProfilePage({ user, id }) {
  const address =
    isPolkadotAddress(id) || isEthereumAddress(id) ? id : user?.address;
  const tabs = useProfileTabs(address);
  const tabContent = useProfileTabContent(address);

  return (
    <ListLayout
      header={
        <>
          <ProfileBreadcrumbs id={id} />
          <Bio address={address} user={user} id={id} />
        </>
      }
      tabs={tabs}
    >
      {tabContent}
    </ListLayout>
  );
}
