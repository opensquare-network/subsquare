import React, { memo } from "react";
import useIdentityInfo from "next-common/hooks/useIdentityInfo";
import { useWidth } from "./util";
import useSubIdentityDisplay from "next-common/hooks/useSubIdentityDisplay";
import { AddressUserImpl } from "./addressUser";

function SubIdentityUser({
  add,
  showAvatar = true,
  fontSize = 14,
  noEvent = false,
  maxWidth: propMaxWidth,
  noTooltip = false,
  color,
  ellipsis = true,
  link,
}) {
  const address = add;
  const { identity, hasIdentity } = useIdentityInfo(address);
  const { isLoading, displayParent, display } = useSubIdentityDisplay(address);

  let subIdentity = identity;
  if (identity && !isLoading) {
    subIdentity = {
      ...identity,
      info: {
        ...identity.info,
        displayParent,
        display,
      },
    };
  }

  const maxWidth = useWidth(showAvatar, subIdentity, propMaxWidth);

  if (!subIdentity) {
    return null;
  }

  return (
    <AddressUserImpl
      address={address}
      identity={subIdentity}
      hasIdentity={hasIdentity}
      maxWidth={maxWidth}
      showAvatar={showAvatar}
      fontSize={fontSize}
      noEvent={noEvent}
      noTooltip={noTooltip}
      color={color}
      ellipsis={ellipsis}
      link={link}
    />
  );
}

export default memo(SubIdentityUser);
