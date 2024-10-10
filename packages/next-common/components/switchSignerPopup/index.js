import { useUser } from "next-common/context/user";
import Popup from "../popup/wrapper/Popup";
import {
  useExtensionAccounts,
  useSignerContext,
} from "../popupWithSigner/context";
import Account from "../account";
import { cn } from "next-common/utils";
import { ArrowRight } from "@osn/icons/subsquare";
import { usePopupOnClose } from "next-common/context/popup";
import {
  OnChainProxiesProvider,
  useMyProxied,
} from "next-common/context/proxy";

function AccountItem({ disabled, account, onClick }) {
  if (disabled) {
    return (
      <div
        className={cn(
          "flex gap-[12px] p-[12px] pr-[16px] items-center",
          "bg-neutral200 rounded-[8px]",
        )}
      >
        <Account account={account} showFullAddress />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "cursor-pointer",
        "flex gap-[12px] p-[12px] pr-[16px] items-center",
        "bg-neutral100 border border-neutral400 hover:border-neutral500 rounded-[8px] group",
      )}
      onClick={onClick}
    >
      <Account account={account} showFullAddress />
      <ArrowRight className="w-[20px] h-[20px] [&_path]:stroke-textTertiary group-hover:[&_path]:stroke-textSecondary" />
    </div>
  );
}

function OriginAddress() {
  const onClose = usePopupOnClose();
  const { signerAccount, setProxyAddress } = useSignerContext();
  const user = useUser();
  const extensionAccounts = useExtensionAccounts();
  const account = extensionAccounts.find(
    (item) => item.address === user.address,
  );

  const disabled = !signerAccount.proxyAddress;

  return (
    <div className="flex flex-col gap-[12px]">
      <div className="text14Bold text-textPrimary">Connected account</div>
      <AccountItem
        disabled={disabled}
        account={account}
        onClick={() => {
          setProxyAddress();
          onClose();
        }}
      />
    </div>
  );
}

function ProxyAddress({ address }) {
  const onClose = usePopupOnClose();
  const { signerAccount, setProxyAddress } = useSignerContext();
  const extensionAccounts = useExtensionAccounts();
  const account = extensionAccounts.find((item) => item.address === address);
  const disabled = signerAccount.proxyAddress === address;
  return (
    <AccountItem
      disabled={disabled}
      account={account}
      onClick={() => {
        setProxyAddress(address);
        onClose();
      }}
    />
  );
}

function ProxiedAccounts() {
  const { value: proxies } = useMyProxied();

  if (!proxies.length) {
    return null;
  }

  return (
    <div className="flex flex-col gap-[12px]">
      <div className="text14Bold text-textPrimary">Proxied accounts</div>
      <div className="flex flex-col">
        {proxies.map((proxy, index) => (
          <ProxyAddress key={index} address={proxy.delegator} />
        ))}
      </div>
    </div>
  );
}

export default function SwitchSignerPopup({ onClose }) {
  return (
    <Popup title="Select Address" className="w-[640px]" onClose={onClose}>
      <div className="flex flex-col gap-[24px]">
        <OriginAddress />
        <OnChainProxiesProvider>
          <ProxiedAccounts />
        </OnChainProxiesProvider>
      </div>
    </Popup>
  );
}
