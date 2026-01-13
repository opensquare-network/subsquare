import tw from "tailwind-styled-components";
import { cn } from "next-common/utils";
import Divider from "next-common/components/styled/layout/divider";
import { AddressUser } from "next-common/components/user";
import { isNil } from "lodash-es";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";

export const IdentityPropListWrapper = tw.div`
space-y-2 ml-14 max-sm:ml-0
`;

export const IdentityPropListLabel = tw.div`
text14Medium text-textTertiary w-60 max-sm:w-auto
`;

export const IdentityPropListValue = tw.div`
text14Medium text-textPrimary
`;

const list = [
  { label: "Display Name", valueKey: "display" },
  { label: "Legal Name", valueKey: "legal" },
  { label: "Email", valueKey: "email" },
  { label: "Website", valueKey: "web" },
  { label: "Twitter", valueKey: "twitter" },
  { label: "Discord", valueKey: "discord" },
  { label: "Matrix Name", valueKey: "matrix" },
  { label: "Github Name", valueKey: "github" },
];

const renderIdentityInfo = (value) => {
  if (isNil(value)) return "-";

  if (typeof value === "object") {
    const keys = Object.keys(value);
    if (keys.length > 0) {
      return value[keys[0]] || "-";
    }
  }

  return value || "-";
};

export default function IdentityPropList({ identityInfo, className = "" }) {
  if (isNil(identityInfo)) return null;

  return (
    <IdentityPropListWrapper
      className={cn("space-y-2 ml-14 max-sm:ml-0", className)}
    >
      {list.map((item) => (
        <div key={item.label} className="flex max-sm:justify-between">
          <IdentityPropListLabel>{item.label}</IdentityPropListLabel>
          <IdentityPropListValue>
            {renderIdentityInfo(identityInfo[item.valueKey])}
          </IdentityPropListValue>
        </div>
      ))}
    </IdentityPropListWrapper>
  );
}

export function SubIdentityDisplay({
  isSubIdentity,
  parentAddress,
  className = "",
}) {
  if (!isSubIdentity) return null;
  return (
    <>
      <Divider className="my-4" />
      <IdentityPropListWrapper
        className={cn("space-y-2 ml-14 max-sm:ml-0", className)}
      >
        <div className="flex max-sm:justify-between">
          <IdentityPropListLabel>Parent</IdentityPropListLabel>
          <IdentityPropListValue>
            <AddressUser
              className="ml-1.5"
              add={parentAddress}
              showAvatar={false}
            />
          </IdentityPropListValue>
        </div>
      </IdentityPropListWrapper>
      <Divider className="my-4" />
    </>
  );
}

export function SubIdentityInfoPanel({ isSubIdentity, parentAddress }) {
  if (!isSubIdentity) return null;

  return (
    <GreyPanel className="px-4 py-2.5 text14Medium text-textSecondary mb-4">
      Currently displayed as the sub identity of{" "}
      <AddressUser className="ml-1.5" add={parentAddress} showAvatar={false} />.
    </GreyPanel>
  );
}
