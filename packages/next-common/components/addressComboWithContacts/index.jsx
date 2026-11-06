import { useMemo } from "react";
import AddressCombo from "next-common/components/addressCombo";
import { useExtensionAccounts } from "next-common/components/popupWithSigner/context";
import { useIsLoggedIn } from "next-common/context/user";
import useContacts from "next-common/hooks/useContacts";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";

export const ACCOUNT_GROUPS = {
  CONTACTS: "Contacts",
  EXTENSIONS: "Extension accounts",
};

export default function AddressComboWithContacts({
  address,
  setAddress,
  readOnly = false,
  size = "default",
  placeholder = "Please fill the address or select another one...",
}) {
  const isLoggedIn = useIsLoggedIn();
  const { contacts } = useContacts(isLoggedIn);
  const extensionAccounts = useExtensionAccounts();

  const accountGroups = useMemo(() => {
    const contactAccounts = (contacts || []).map((contact) => ({
      address: contact.address,
      displayAddress: tryConvertToEvmAddress(contact.address),
      name: contact.name,
    }));

    const extensionAccountOptions = (extensionAccounts || []).map(
      (account) => ({
        address: account.address,
        displayAddress:
          account.evmAddress || tryConvertToEvmAddress(account.address),
        name: account.meta?.name,
        disabled: account?.disabled ?? false,
      }),
    );

    return [
      { title: ACCOUNT_GROUPS.CONTACTS, accounts: contactAccounts },
      { title: ACCOUNT_GROUPS.EXTENSIONS, accounts: extensionAccountOptions },
    ];
  }, [contacts, extensionAccounts]);

  return (
    <AddressCombo
      accountGroups={accountGroups}
      address={address}
      setAddress={setAddress}
      readOnly={readOnly}
      size={size}
      placeholder={placeholder}
    />
  );
}
