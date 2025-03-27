import React, { memo } from "react";
import useIdentityInfo from "next-common/hooks/useIdentityInfo";
import { useWidth } from "./util";
import useSubIdentityDisplay from "next-common/hooks/useSubIdentityDisplay";
import { AddressUserImpl } from "./addressUser";

function SubIdentityUser({
  className = "text14Medium text-textPrimary",
  add,
  showAvatar = true,
  noEvent = false,
  maxWidth: propMaxWidth,
  noTooltip = false,
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
      className={className}
      address={address}
      identity={subIdentity}
      hasIdentity={hasIdentity}
      maxWidth={maxWidth}
      showAvatar={showAvatar}
      noEvent={noEvent}
      noTooltip={noTooltip}
      ellipsis={ellipsis}
      link={link}
    />
  );
}

export default memo(SubIdentityUser);
