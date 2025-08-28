import Loading from "next-common/components/loading";
import { isIdentityEmpty } from "next-common/components/people/common";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import { useIdentityType } from "next-common/hooks/people/useMyIdentityType";
import { usePeopleApi } from "next-common/context/people/api";
import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { DirectIdentityContent } from "next-common/components/profile/identity/directIdentityContent";
import ChildInfo from "./childInfo";

export default function DirectIdentity({ identityInfo, isLoading }) {
  const api = usePeopleApi();
  const address = useProfileAddress();
  const { type, parent, subName } = useIdentityType(api, address);

  if (isLoading) {
    return <IdentityContentLoading />;
  }

  if (isIdentityEmpty(identityInfo)) {
    if (type === "sub") {
      return (
        <>
          <GreyPanel className="px-4 py-2.5 text14Medium text-textSecondary">
            No direct identity
          </GreyPanel>
          <ChildInfo parentAddress={parent} subName={subName} />
        </>
      );
    }

    return <IdentityContentEmpty />;
  }

  return (
    <DirectIdentityContent
      identityInfo={identityInfo}
      type={type}
      parentAddress={parent}
      address={address}
    />
  );
}

export function IdentityContentLoading() {
  return (
    <div className="flex justify-center items-center h-full">
      <Loading size="24" />
    </div>
  );
}

export function IdentityContentEmpty() {
  return (
    <GreyPanel className="px-4 py-2.5 text14Medium text-textSecondary">
      No direct identity
    </GreyPanel>
  );
}
