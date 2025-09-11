import Copyable from "next-common/components/copyable";
import { useUser } from "next-common/context/user";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";
import { isEthereumAddress } from "@polkadot/util-crypto";
import AccountLinks from "next-common/components/links/accountLinks";
import { AvatarDisplay } from "next-common/components/user/avatarDisplay";
import { ProxyTip } from "next-common/components/overview/accountInfo/accountInfoPanel.js";
import ExtensionUpdatePrompt from "next-common/components/overview/accountInfo/components/extensionUpdatePrompt";
import AddressUser from "next-common/components/user/addressUser";

export default function HeadContent() {
  const address = useRealAddress();
  const user = useUser();

  const maybeEvmAddress = tryConvertToEvmAddress(address);

  return (
    <div className="flex flex-col gap-[16px]">
      <div className="flex items-start gap-[16px]">
        <AvatarDisplay
          avatarCid={user?.avatarCid}
          address={address}
          emailMd5={user?.emailMd5}
          size={48}
        />
        <div className="flex flex-col gap-[4px]">
          <AddressUser
            add={address}
            maxWidth={176}
            showAvatar={false}
            className="text16Bold text-textPrimary"
          />
          <Copyable copyText={maybeEvmAddress}>
            <span className="text14Medium text-textTertiary">
              {maybeEvmAddress}
            </span>
          </Copyable>
          {!isEthereumAddress(maybeEvmAddress) && (
            <AccountLinks address={maybeEvmAddress} />
          )}
        </div>
      </div>
      <ProxyTip />
      <ExtensionUpdatePrompt />
    </div>
  );
}
