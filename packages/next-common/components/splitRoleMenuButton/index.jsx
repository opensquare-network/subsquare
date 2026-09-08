import { MenuAccount, MenuMultisig, MenuProxy } from "@osn/icons/subsquare";
import PrimaryButton from "next-common/lib/button/primary";
import SplitMenuButton from "next-common/lib/button/splitMenuButton";
import AddressUser from "next-common/components/user/addressUser";
import { CuratorBadge } from "next-common/components/treasury/bounty/styled";
import { cn } from "next-common/utils";

const roleIconClassName = "w-4 h-4 text-textTertiary";

function RoleIcon({ role }) {
  if (role?.kind === "proxy") {
    return <MenuProxy className={roleIconClassName} />;
  }
  if (role?.kind === "multisig") {
    return <MenuMultisig className={roleIconClassName} />;
  }
  // direct: the user is (or acts as) the origin account itself.
  return <MenuAccount className={roleIconClassName} />;
}

// Address of a role, if any: proxy delegate, or the multisig address.
function roleAddress(role) {
  if (role?.kind === "proxy") {
    return role.proxy;
  }
  if (role?.kind === "multisig") {
    return role.multisig?.multisigAddress;
  }
  return null;
}

// Threshold badge of a multisig role, e.g. "2/3", styled like the curator
// sidebar badge (null for non-multisig roles).
function roleBadge(role) {
  if (role?.kind !== "multisig") {
    return null;
  }

  const { threshold, signatories } = role.multisig || {};
  const count = signatories?.length || 0;
  return threshold && count ? `${threshold}/${count}` : null;
}

// Text describing a role without its address/badge ("as this account" / "as
// proxy" / "as multisig"); the address and badge are rendered separately.
export function roleMenuLabel(role) {
  switch (role?.kind) {
    case "direct":
      return "as this account";
    case "proxy":
      return "as proxy";
    case "multisig":
      return "as multisig";
    default:
      return "";
  }
}

// Dropdown menu item label: text + badge + AddressUser.
function roleMenuItemLabel(action, role) {
  const text = `${action} ${roleMenuLabel(role)}`.trim();
  const address = roleAddress(role);
  const badge = roleBadge(role);

  return (
    <span className="inline-flex items-center gap-x-2">
      <span>{text}</span>
      {badge && <CuratorBadge badge={badge} />}
      {address && (
        <AddressUser add={address} showAvatar={true} needHref={false} />
      )}
    </span>
  );
}

// SplitMenuButton variant: runs `action` with a chosen role (see
// useAccountRole). One role -> plain primary button; several roles -> both
// the main area and the arrow open a menu listing all roles, picking one runs
// the action with it.
//
// @param action   label of the action, e.g. "Accept Curator"
// @param roles    account dispatch roles; must be non-empty
// @param onClick  (role) => void, fired with the role picked from the menu
export default function SplitRoleMenuButton({
  action,
  roles = [],
  onClick,
  fullWidth = false,
  ...props
}) {
  const defaultRole = roles?.[0];
  const hasMultipleRoles = roles.length > 1;

  // Single role: run the action directly.
  if (!defaultRole || !hasMultipleRoles) {
    return (
      <PrimaryButton
        {...props}
        className={cn(props?.className, fullWidth && "w-full")}
        onClick={() => onClick?.(defaultRole)}
      >
        {action}
      </PrimaryButton>
    );
  }

  // Several roles: main area and arrow both open the menu to pick a role.
  return (
    <SplitMenuButton
      {...props}
      mainClickOpensMenu
      fullWidth={fullWidth}
      dropdownMenuItems={roles.map((role) => ({
        icon: <RoleIcon role={role} />,
        label: roleMenuItemLabel(action, role),
        onClick: () => onClick?.(role),
      }))}
    >
      {action}
    </SplitMenuButton>
  );
}
