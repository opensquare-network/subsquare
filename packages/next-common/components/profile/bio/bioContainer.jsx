import UserBio from "next-common/components/userBio";
import Divider from "next-common/components/styled/layout/divider";
import { useAvatarPermissionsContext } from "../header/context/avatarPermissionsContext";
import { useProfileUserInfoContext } from "../header/context/profileUserInfoContext";

export default function BioContainer() {
  const { user } = useProfileUserInfoContext();
  const { isSelf, isProxyAccount } = useAvatarPermissionsContext();

  const hasPermission = isSelf || isProxyAccount;

  if (!user?.bio && !hasPermission) {
    return null;
  }

  return (
    <div className="w-full gap-y-2 flex flex-col">
      <Divider />
      <UserBio bio={user?.bio} hasPermission={hasPermission} />
    </div>
  );
}
