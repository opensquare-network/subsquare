import useIdentityInfo from "next-common/hooks/useIdentityInfo";
import { AddressUserImpl, AddressUserWrapper } from "./addressUser";
import AccountName from "./accountName";

export default function MultisigAddress(props = {}) {
  const {
    className,
    address,
    avatar,
    showAvatar = true,
    avatarSize = "",
    noEvent = false,
    link = "",
    needHref = true,
    maxWidth,
    noTooltip = false,
    accountName = "",
  } = props;
  const { identity, hasIdentity } = useIdentityInfo(address);

  if (!hasIdentity && accountName) {
    return (
      <AddressUserWrapper
        className={className}
        address={address}
        avata={avatar}
        showAvatar={showAvatar}
        avatarSize={avatarSize}
        noEvent={noEvent}
        link={link}
        needHref={needHref}
      >
        <AccountName
          className={className}
          accountName={accountName}
          maxWidth={maxWidth}
          noTooltip={noTooltip}
        />
      </AddressUserWrapper>
    );
  }

  return (
    <AddressUserImpl {...props} identity={identity} hasIdentity={hasIdentity} />
  );
}
