import React, { memo } from "react";
import * as HoverCard from "@radix-ui/react-hover-card";
import { cn } from "next-common/utils";
import { useIsMobileDevice } from "next-common/hooks/useIsMobileDevice";
import TrackStreamlinedDetails from "./trackStreamlinedDetails";
import { isNil } from "lodash-es";

function TrackTooltip({
  trackId,
  children,
  className = "",
  style = {},
  activeCount = 0,
}) {
  const isMobile = useIsMobileDevice();
  if (isNil(trackId) || !children) {
    return null;
  }

  if (isMobile) {
    return children;
  }

  const tooltipTrigger = (
    <div className={cn("inline-block", className)} style={style}>
      {children}
    </div>
  );

  return (
    <div className="flex items-center">
      <HoverCard.Root>
        <HoverCard.Trigger asChild>{tooltipTrigger}</HoverCard.Trigger>

        <HoverCard.Portal>
          <HoverCard.Content
            side="right"
            sideOffset={0}
            align="end"
            className="pl-2 z-50"
          >
            <TrackStreamlinedDetails
              trackId={trackId}
              activeCount={activeCount}
            />
          </HoverCard.Content>
        </HoverCard.Portal>
      </HoverCard.Root>
    </div>
  );
}

export default memo(TrackTooltip);
