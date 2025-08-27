import Loading from "next-common/components/loading";
import IdentityPropList, {
  SubIdentityDisplay,
} from "next-common/components/people/overview/identity/identityPropList";
import { isIdentityEmpty } from "next-common/components/people/common";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import { useIdentityType } from "next-common/hooks/people/useMyIdentityType";
import { usePeopleApi } from "next-common/context/people/api";
import useProfileAddress from "next-common/components/profile/useProfileAddress";

export default function DirectIdentity({ identityInfo, isLoading }) {
  const api = usePeopleApi();
  const address = useProfileAddress();
  const { type, parent } = useIdentityType(api, address);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loading size="24" />
      </div>
    );
  }

  if (isIdentityEmpty(identityInfo)) {
    return (
      <GreyPanel className="px-4 py-2.5 text14Medium text-textSecondary">
        User has no identity.
      </GreyPanel>
    );
  }

  return (
    <>
      <IdentityPropList
        className="ml-0"
        identityInfo={identityInfo}
        isLoading={isLoading}
      />
      <SubIdentityDisplay
        isSubIdentity={type === "sub"}
        parentAddress={parent}
      />
    </>
  );
}
