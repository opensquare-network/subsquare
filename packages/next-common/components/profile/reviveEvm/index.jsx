import ProfileLayout from "next-common/components/layout/ProfileLayout";
import ProfileHeaderWithBanner from "next-common/components/profile/header";
import AvatarPermissionsProvider from "next-common/components/profile/header/context/avatarPermissionsContext";
import ProfileUserInfoProvider from "next-common/components/profile/header/context/profileUserInfoContext";
import Bio from "./bio";
import useReviveEvmProfile from "./useReviveEvmProfile";

export default function ReviveEvmProfile() {
  const { evmAddress, substrateAddress, isResolving } = useReviveEvmProfile();

  return (
    <AvatarPermissionsProvider>
      <ProfileUserInfoProvider address={isResolving ? "" : substrateAddress}>
        <ProfileLayout
          pageHeader={<ProfileHeaderWithBanner />}
          header={
            <Bio
              evmAddress={evmAddress}
              substrateAddress={substrateAddress}
              isResolving={isResolving}
            />
          }
        />
      </ProfileUserInfoProvider>
    </AvatarPermissionsProvider>
  );
}
