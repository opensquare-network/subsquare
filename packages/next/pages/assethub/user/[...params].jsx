import ProfileAssets from "next-common/components/profile/assets";
import ProfileForeignAssets from "next-common/components/profile/foreignAssets";
import Bio from "next-common/components/profile/bio";
import { useProfileAssetHubTabs } from "next-common/components/profile/tabs/useProfileAssetHubTabs";
import ProfileHeaderWithBanner from "next-common/components/profile/header";
import ProfileLayout from "next-common/components/layout/ProfileLayout";
import ProfileUserInfoProvider from "next-common/components/profile/header/context/profileUserInfoContext";
import { AssetHubPageProvider } from "./";

export { getServerSideProps } from "../../user/[...params]";

export default function AssetHubUserPage() {
  return (
    <AssetHubPageProvider>
      <ProfileUserInfoProvider>
        <AssetHubUserPageImpl />
      </ProfileUserInfoProvider>
    </AssetHubPageProvider>
  );
}

function AssetHubUserPageImpl() {
  const tabs = useProfileAssetHubTabs();

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
      <div className="flex flex-col gap-[16px]">
        <ProfileAssets />
        <ProfileForeignAssets />
      </div>
    </ProfileLayout>
  );
}
