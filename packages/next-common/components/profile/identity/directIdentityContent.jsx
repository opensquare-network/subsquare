import Account from "next-common/components/account";
import IdentityPropList, {
  SubIdentityDisplay,
  SubIdentityInfoPanel,
} from "next-common/components/people/overview/identity/common";
import Divider from "next-common/components/styled/layout/divider";

export function DirectIdentityContent({
  address,
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
        <Account account={{ address }} addressClassName="!text14Medium" />
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
