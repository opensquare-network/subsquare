import Popup from "next-common/components/popup/wrapper/Popup";
import {
  AllAccountsProvider,
  useAllAccounts,
} from "next-common/components/wallet/allAccounts";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import Divider from "next-common/components/styled/layout/divider";
import { SystemWallet, SystemSearch } from "@osn/icons/subsquare";
import AccountItem, { ConnectedAccountItem } from "./accountItem";
import { useUser } from "next-common/context/user";
import Input from "next-common/lib/input";
import { useState } from "react";

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

function SelectAccounts() {
  const user = useUser();
  const { accounts, isLoading } = useAllAccounts();

  if (isLoading) {
    return null;
  }

  // TODO: switch account
  // const onClick = (user) => {
  //   console.log(":::user", user);
  // };

  return (
    <div className="text14Medium text-textSecondary space-y-3">
      <SubTitle />
      <ConnectedAccountItem user={user} />
      {accounts.map((account) => {
        return (
          <AccountItem
            user={account}
            key={account?.address}
            // onClick={onClick}
          />
        );
      })}
    </div>
  );
}

function ChangeWallet({ onClick }) {
  return (
    <div className="w-full grid grid-cols-2">
      <div
        role="button"
        onClick={onClick}
        className="flex items-center space-x-1 pl-3 pr-4 py-2.5 border border-neutral400 rounded-lg"
      >
        <SystemWallet className="w-6 h-6" />
        <span className="text14Bold text-textPrimary">Change Wallet</span>
      </div>
      <div></div>
    </div>
  );
}

function TextDivider() {
  return (
    <div className="w-full flex items-center justify-center mt-6">
      <Divider className="flex-1" />
      <span className="text12Medium text-textTertiary mx-4">
        Can&apos;t find your account?
      </span>
      <Divider className="flex-1" />
    </div>
  );
}

function PopupContent() {
  const [searchValue, setSearchValue] = useState(null);
  // TOOD: Search
  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <div className="space-y-6">
      <Input
        className="mt-4"
        prefix={
          <SystemSearch width={24} height={24} className="text-textTertiary" />
        }
        placeholder={"Search for address or identity"}
        value={searchValue}
        onChange={handleInputChange}
      />
      <SelectAccounts />
    </div>
  );
}

export default function SwitchWeb3({ onClose, onOpenLogin }) {
  return (
    <AllAccountsProvider>
      <Popup title={<PopupTitle />} onClose={onClose} className="p-12">
        <PopupContent />
        <TextDivider />
        <ChangeWallet onClick={onOpenLogin} />
      </Popup>
    </AllAccountsProvider>
  );
}
