import IdentityIcon from "./identityIcon";
import Tooltip from "../tooltip";
import { getIdentityDisplay } from "next-common/utils/identity";
import { cn } from "next-common/utils";

export function UnStyledIdentity({
  identity,
  maxWidth,
  ellipsis = false,
  identityIconClassName = "",
  noTooltip = false,
}) {
  if (!identity || identity?.info?.status === "NO_ID") {
    return null;
  }

  const displayName = getIdentityDisplay(identity);
  const shouldShowTooltip = maxWidth || ellipsis;
  const displayNameElement = (
    <span
      className={cn(
        shouldShowTooltip && "line-clamp-1 break-all overflow-hidden",
      )}
      style={{ maxWidth }}
    >
      {displayName}
    </span>
  );

  const tooltipContent = identity?.info?.tooltip || displayName;

  return (
    <div className="flex items-center identity">
      <IdentityIcon
        identity={identity}
        className="mr-1"
        iconClassName={identityIconClassName}
      />
      {noTooltip ? (
        displayNameElement
      ) : (
        <Tooltip content={shouldShowTooltip ? tooltipContent : null}>
          {displayNameElement}
        </Tooltip>
      )}
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
