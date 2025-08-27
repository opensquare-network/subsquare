import IdentityPropList, {
  SubIdentityDisplay,
  SubIdentityInfoPanel,
} from "next-common/components/people/overview/identity/common";
import { Account } from "next-common/components/overview/accountInfo/accountInfoPanel";
import Divider from "next-common/components/styled/layout/divider";

export function DirectIdentityContent({
  identityInfo,
  type,
  parentAddress,
  children,
}) {
  const isSubIdentity = type === "sub";

  return (
    <>
      <SubIdentityInfoPanel
        isSubIdentity={isSubIdentity}
        parentAddress={parentAddress}
      />
      <div className="flex justify-between gap-2">
        <Account />
        {children}
      </div>

      <Divider className="my-4" />
      <IdentityPropList identityInfo={identityInfo} />
      <SubIdentityDisplay
        isSubIdentity={isSubIdentity}
        parentAddress={parentAddress}
      />
    </>
  );
}
