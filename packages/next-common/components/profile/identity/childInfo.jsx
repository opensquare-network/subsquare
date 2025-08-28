import {
  IdentityPropListLabel,
  IdentityPropListValue,
  IdentityPropListWrapper,
} from "next-common/components/people/overview/identity/common";
import Divider from "next-common/components/styled/layout/divider";
import { AddressUser } from "next-common/components/user";
import { cn } from "next-common/utils";

export default function ChildInfo({ parentAddress, subName, className = "" }) {
  return (
    <>
      <Divider className="my-4" />
      <IdentityPropListWrapper className={cn("space-y-2 ml-0", className)}>
        <div className="flex">
          <IdentityPropListLabel>Parent</IdentityPropListLabel>
          <IdentityPropListValue>
            <AddressUser className="ml-1.5" add={parentAddress} />
          </IdentityPropListValue>
        </div>
        <div className="flex">
          <IdentityPropListLabel>Sub name</IdentityPropListLabel>
          <IdentityPropListValue>{subName}</IdentityPropListValue>
        </div>
      </IdentityPropListWrapper>
    </>
  );
}
