import SecondaryButton from "next-common/lib/button/secondary";
import { useCallback, useState } from "react";
import SelectProxyAccountPopup from "../selectProxyAccountPopup";
import ProxyAvatarPopup from "../proxyAvatarPopup";

export default function ProxyAvatar() {
  const [proxyAddress, setProxyAddress] = useState("");
  const [isProxyAvatarPopupOpen, setIsProxyAvatarPopupOpen] = useState(false);
  const [isSelectProxyAccountPopupOpen, setIsSelectProxyAccountPopupOpen] =
    useState(false);

  const onSelectProxyAccount = useCallback((address) => {
    setProxyAddress(address);
    setIsProxyAvatarPopupOpen(true);
  }, []);

  return (
    <>
      <div className="flex justify-between items-center">
        <span className="text14Medium text-textPrimary">
          You can set avatars for your proxied accounts
        </span>
        <SecondaryButton
          size="small"
          onClick={() => setIsSelectProxyAccountPopupOpen(true)}
        >
          Set Avatar As Proxy
        </SecondaryButton>
      </div>
      {isSelectProxyAccountPopupOpen && (
        <SelectProxyAccountPopup
          onClose={() => setIsSelectProxyAccountPopupOpen(false)}
          onSelect={onSelectProxyAccount}
        />
      )}
      {isProxyAvatarPopupOpen && (
        <ProxyAvatarPopup
          proxyAddress={proxyAddress}
          onClose={() => setIsProxyAvatarPopupOpen(false)}
        />
      )}
    </>
  );
}
