import React from "react";
import { addressEllipsis } from "../../utils";
import Tooltip from "../tooltip";
import Username from "./username";
import { useIsKeyUser } from "next-common/context/user";

export default function UserDisplay({
  user,
  fontSize,
  color,
  maxWidth,
  noTooltip,
  ellipsis,
}) {
  const isKeyUser = useIsKeyUser(user);

  let username = user?.username;
  let tip = user?.username;

  if (isKeyUser) {
    username = ellipsis ? addressEllipsis(user?.address) : user?.address;
    tip = user?.address;
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
