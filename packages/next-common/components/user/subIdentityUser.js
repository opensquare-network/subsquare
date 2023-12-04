import React, { memo } from "react";
import useIdentityInfo from "next-common/hooks/useIdentityInfo";
import { useWidth } from "./util";
import DeletedAccount from "./deletedAccount";
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
  linkToVotesPage = false,
  ellipsis = true,
  externalLink,
}) {
  const address = add;
  const [identity, hasIdentity] = useIdentityInfo(address);
  const subIdentityDisplay = useSubIdentityDisplay(address);
  let subIdentity = null;
  if (identity) {
    subIdentity = {
      ...identity,
      info: {
        ...identity.info,
        ...subIdentityDisplay,
      },
    };
  }

  const maxWidth = useWidth(showAvatar, subIdentity, propMaxWidth);

  if (!address) {
    return <DeletedAccount fontSize={fontSize} />;
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
      linkToVotesPage={linkToVotesPage}
      ellipsis={ellipsis}
      externalLink={externalLink}
    />
  );
}

export default memo(SubIdentityUser);
