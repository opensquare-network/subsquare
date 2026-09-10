import { MenuAccount, MenuMultisig, MenuProxy } from "@osn/icons/subsquare";
import AddressUser from "next-common/components/user/addressUser";
import { CuratorBadge } from "next-common/components/treasury/bounty/styled";

// Role menu content shared by the role menu button variants: the primary one
// (index.jsx) and the text one (text.jsx). Only the button rendering differs
// between them.

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

// Items of the role dropdown, one per dispatch role.
export function buildRoleMenuItems({ action, roles, onClick }) {
  return roles.map((role) => ({
    icon: <RoleIcon role={role} />,
    label: roleMenuItemLabel(action, role),
    onClick: () => onClick?.(role),
  }));
}
