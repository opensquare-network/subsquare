import { AddressUser } from "next-common/components/user";
import { cn } from "next-common/utils";
import { CuratorTag } from "../styled";

export default function AccountDisplay({
  address,
  isPure = false,
  isProxy = false,
  badge = "",
  className = "",
}) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <AddressUser
        add={address}
        maxWidth={badge ? 150 : undefined}
        className="my-1"
      />
      {badge && (
        <CuratorTag className="bg-theme100 text-theme500">{badge}</CuratorTag>
      )}
      {isPure && <CuratorTag>Pure</CuratorTag>}
      {isProxy && <CuratorTag>Proxy</CuratorTag>}
    </div>
  );
}
