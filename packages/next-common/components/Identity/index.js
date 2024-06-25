import IdentityIcon from "./identityIcon";
import Tooltip from "../tooltip";
import { getIdentityDisplay } from "next-common/utils/identity";
import { cn } from "next-common/utils";

export default function Identity({
  identity,
  fontSize = 14,
  maxWidth,
  className = "",
  ellipsis = false,
}) {
  if (!identity || identity?.info?.status === "NO_ID") {
    return null;
  }

  const displayName = getIdentityDisplay(identity);
  const shouldShowTooltip = maxWidth || ellipsis;

  return (
    <div
      className={cn("identity", "text14Medium", "flex items-center", className)}
    >
      <IdentityIcon identity={identity} className="mr-1" />
      <Tooltip
        content={shouldShowTooltip ? displayName : null}
        className={cn(shouldShowTooltip && "!line-clamp-1 break-all")}
        style={{ fontSize, maxWidth }}
      >
        {displayName}
      </Tooltip>
    </div>
  );
}
