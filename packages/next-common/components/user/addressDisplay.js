import React from "react";
import { addressEllipsis } from "../../utils";
import Tooltip from "../tooltip";
import { KNOWN_ADDR_MATCHERS } from "next-common/utils/knownAddr";
import { IdentitySpecial } from "@osn/icons/subsquare";
import Username from "./username";

export default function AddressDisplay({
  address,
  fontSize,
  color,
  maxWidth,
  ellipsis,
  noTooltip,
  addressClassName = "",
}) {
  const knownAddr = KNOWN_ADDR_MATCHERS.map((matcher) => matcher(address)).find(
    Boolean,
  );

  const username = knownAddr || (ellipsis ? addressEllipsis(address) : address);

  const name = (
    <Username
      username={username}
      fontSize={fontSize}
      color={color}
      maxWidth={maxWidth}
      addressClassName={addressClassName}
    />
  );

  return (
    <div className="flex items-center gap-[4px]">
      {knownAddr && (
        <Tooltip content="Special account">
          <IdentitySpecial width={12} height={12} />
        </Tooltip>
      )}
      {maxWidth && !noTooltip ? (
        <Tooltip content={address}>
          <div>{name}</div>
        </Tooltip>
      ) : (
        name
      )}
    </div>
  );
}
