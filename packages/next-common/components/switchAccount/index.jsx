import Popup from "next-common/components/popup/wrapper/Popup";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import Divider from "next-common/components/styled/layout/divider";
import { SystemWallet, SystemSearch } from "@osn/icons/subsquare";
import AccountItem, { ConnectedAccountItem } from "./accountItem";
import { useUser } from "next-common/context/user";
import Input from "next-common/lib/input";
import { useState, useCallback } from "react";
import useSearchAccounts from "./useSearchAccounts";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import { useExtensionAccounts } from "next-common/components/popupWithSigner/context";
import { useConnectedAccountContext } from "next-common/context/connectedAccount";
import { useWeb3Login } from "next-common/hooks/connect/useWeb3Login";
import NoData from "next-common/components/noData";
import WindowSizeProvider from "next-common/context/windowSize";
import { useIsMobile } from "next-common/components/overview/accountInfo/components/accountBalances";

function PopupTitle() {
  return (
    <span className="text20Bold text-textPrimary">
      <span>Switch </span>
      <span className="text-theme500">Account</span>
    </span>
  );
}

function SubTitle() {
  return (
    <TitleContainer className="text14Bold px-0 pb-0">
      Select Account
    </TitleContainer>
  );
}

function Empty() {
  return (
    <NoData showIcon={false} text="No results found" className={"py-2.5"} />
  );
}

function AccountList({ accounts = [], isEmpty = false }) {
  const user = useUser();
  const [web3Login] = useWeb3Login();
  const { lastConnectedAccount } = useConnectedAccountContext();
  const isMobile = useIsMobile();

  const onClick = useCallback(
    async (account) => {
      await web3Login({
        account,
        wallet: lastConnectedAccount?.wallet,
      });
    },
    [web3Login, lastConnectedAccount?.wallet],
  );

  if (isEmpty) {
    return <Empty />;
  }

  return (
    <div
      className="text14Medium text-textSecondary space-y-3 overflow-y-auto"
      style={{ maxHeight: `calc(76vh - ${isMobile ? 312 : 360}px)` }}
    >
      {accounts?.map((account) => {
        if (account?.address === user?.address) {
          return <ConnectedAccountItem user={account} key={account?.address} />;
        }

        return (
          <AccountItem
            user={account}
            key={account?.address}
            onClick={onClick}
          />
        );
      })}
    </div>
  );
}

function ChangeWallet({ onClick }) {
  return (
    <div className="w-full grid grid-cols-2 max-sm:grid-cols-1">
      <div
        role="button"
        onClick={onClick}
        className="flex items-center space-x-3 pl-3 pr-4 py-2.5 border border-neutral400 rounded-lg"
      >
        <SystemWallet className="w-6 h-6 text-textSecondary" />
        <span className="text14Bold text-textPrimary">Change Wallet</span>
      </div>
    </div>
  );
}

function TextDivider() {
  return (
    <div className="w-full flex items-center justify-center">
      <Divider className="flex-1" />
      <span className="text12Medium text-textTertiary mx-4">
        Can&apos;t find your account?
      </span>
      <Divider className="flex-1" />
    </div>
  );
}

function PopupContent() {
  const [searchValue, setSearchValue] = useState("");
  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };
  const accounts = useExtensionAccounts();
  const filteredAccounts = useSearchAccounts(searchValue, accounts);

  const isEmpty = searchValue && filteredAccounts?.length === 0;
  return (
    <div className="space-y-6 flex-1">
      <Input
        prefix={
          <SystemSearch width={24} height={24} className="text-textTertiary" />
        }
        placeholder={"Search for address or identity"}
        value={searchValue}
        onChange={handleInputChange}
      />
      <div className="space-y-3 flex-1 overflow-hidden">
        <SubTitle />
        <AccountList accounts={filteredAccounts} isEmpty={isEmpty} />
      </div>
    </div>
  );
}

export default function SwitchAccount({ onClose, onOpenLogin }) {
  return (
    <WindowSizeProvider>
      <SignerPopupWrapper>
        <Popup
          title={<PopupTitle />}
          showCloseIcon={false}
          onClose={onClose}
          className="flex flex-col space-y-6 p-12 !mb-0 max-sm:!p-6 max-h-[76vh]"
          style={{ maxWidth: "76vh" }}
        >
          <PopupContent />
          <TextDivider />
          <ChangeWallet onClick={onOpenLogin} />
        </Popup>
      </SignerPopupWrapper>
    </WindowSizeProvider>
  );
}
