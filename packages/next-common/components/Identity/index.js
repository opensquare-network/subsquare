import IdentityIcon from "./identityIcon";
import Tooltip from "../tooltip";
import { getIdentityDisplay } from "next-common/utils/identity";
import { cn } from "next-common/utils";

export function UnStyledIdentity({
  identity,
  maxWidth,
  ellipsis = false,
  identityIconClassName = "",
  customDisplayName = "",
}) {
  if (!identity || identity?.info?.status === "NO_ID") {
    return null;
  }

  const displayName = customDisplayName || getIdentityDisplay(identity);
  const shouldShowTooltip = maxWidth || ellipsis;

  return (
    <div className="flex items-center identity">
      <IdentityIcon
        identity={identity}
        className="mr-1"
        iconClassName={identityIconClassName}
      />
      <Tooltip
        content={shouldShowTooltip ? displayName : null}
        className={cn(shouldShowTooltip && "!line-clamp-1 break-all")}
        style={{ maxWidth }}
      >
        {displayName}
      </Tooltip>
    </div>
  );
}

export default function Identity({
  identity,
  maxWidth,
  className = "text14Medium text-textPrimary",
  ellipsis,
  identityIconClassName = "",
}) {
  return (
    <div className={className}>
      <UnStyledIdentity
        identity={identity}
        maxWidth={maxWidth}
        ellipsis={ellipsis}
        iconClassName={identityIconClassName}
      />
    </div>
  );
}
