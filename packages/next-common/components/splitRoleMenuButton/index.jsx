import PrimaryButton from "next-common/lib/button/primary";
import SecondaryButton from "next-common/lib/button/secondary";
import SplitMenuButton from "next-common/lib/button/splitMenuButton";
import { cn } from "next-common/utils";
import { buildRoleMenuItems } from "./roleMenuItems";

export { roleMenuLabel } from "./roleMenuItems";

// SplitMenuButton variant: runs `action` with a chosen role (see
// useAccountRole). One role -> plain button; several roles -> both
// the main area and the arrow open a menu listing all roles, picking one runs
// the action with it.
//
// @param action   label of the action, e.g. "Accept Curator"
// @param roles    account dispatch roles; must be non-empty
// @param onClick  (role) => void, fired with the role picked from the menu
// @param variant  color of the button: "primary" (default, filled) or
//                 "secondary" (outline)
export default function SplitRoleMenuButton({
  action,
  roles = [],
  onClick,
  fullWidth = false,
  variant = "primary",
  ...props
}) {
  const defaultRole = roles?.[0];
  const hasMultipleRoles = roles.length > 1;
  const ButtonComponent =
    variant === "secondary" ? SecondaryButton : PrimaryButton;

  // Single role: run the action directly.
  if (!defaultRole || !hasMultipleRoles) {
    return (
      <ButtonComponent
        {...props}
        className={cn(props?.className, fullWidth && "w-full")}
        onClick={() => onClick?.(defaultRole)}
      >
        {action}
      </ButtonComponent>
    );
  }

  // Several roles: main area and arrow both open the menu to pick a role.
  return (
    <SplitMenuButton
      {...props}
      variant={variant}
      mainClickOpensMenu
      fullWidth={fullWidth}
      dropdownMenuItems={buildRoleMenuItems({ action, roles, onClick })}
    >
      {action}
    </SplitMenuButton>
  );
}
