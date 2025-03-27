import React from "react";
import { addressEllipsis } from "../../utils";
import Tooltip from "../tooltip";
import { KNOWN_ADDR_MATCHERS } from "next-common/utils/knownAddr";
import { IdentitySpecial } from "@osn/icons/subsquare";
import Username from "./username";

export default function AddressDisplay({
  address,
  maxWidth,
  ellipsis,
  noTooltip,
}) {
  const knownAddr = KNOWN_ADDR_MATCHERS.map((matcher) => matcher(address)).find(
    Boolean,
  );

  const username = knownAddr || (ellipsis ? addressEllipsis(address) : address);

  return (
    <div className="flex items-center gap-[4px]">
      {knownAddr && (
        <Tooltip content="Special account">
          <IdentitySpecial width={12} height={12} />
        </Tooltip>
      )}
      {maxWidth && !noTooltip ? (
        <Tooltip content={address}>
          <Username username={username} maxWidth={maxWidth} />
        </Tooltip>
      ) : (
        <Username username={username} maxWidth={maxWidth} />
      )}
    </div>
  );
}
