import React from "react";
import { addressEllipsis, isKeyRegisteredUser } from "../../utils";
import Tooltip from "../tooltip";
import Username from "./username";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";

export default function UserDisplay({
  user,
  fontSize,
  color,
  maxWidth,
  noTooltip,
  ellipsis,
}) {
  const isWeb3User = isKeyRegisteredUser(user);

  let username = user?.username;
  let tip = user?.username;

  if (isWeb3User) {
    const address = user?.address;
    const displayAddress = tryConvertToEvmAddress(address);
    username = ellipsis ? addressEllipsis(displayAddress) : displayAddress;
    tip = displayAddress;
  }

  const name = (
    <Username
      username={username}
      fontSize={fontSize}
      color={color}
      maxWidth={maxWidth}
    />
  );

  return (
    <div className="flex items-center gap-[4px]">
      {maxWidth && !noTooltip ? (
        <Tooltip content={tip}>
          <div>{name}</div>
        </Tooltip>
      ) : (
        name
      )}
    </div>
  );
}
