import React, { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { isAddress } from "@polkadot/util-crypto";
import Popup from "next-common/components/popup/wrapper/Popup";
import PopupLabel from "next-common/components/popup/label";
import TextInputField from "next-common/components/popup/fields/textInputField";
import AddressCombo from "next-common/components/addressCombo";
import PrimaryButton from "next-common/lib/button/primary";
import SecondaryButton from "next-common/lib/button/secondary";
import { colorStyle, PromptTypes } from "next-common/components/scrollPrompt";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import nextApi from "next-common/services/nextApi";
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";
import { normalizeAddress } from "next-common/utils/address";
import { getUnsupportedAddressMessage } from "next-common/utils/addressType";
import { isSameAddress } from "next-common/utils";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useContactsContext } from "./context/contactsContext";

export default function AddContactPopup({ onClose }) {
  const realAddress = useRealAddress();
  const dispatch = useDispatch();
  const { contacts, refresh } = useContactsContext();
  const { ensureLogin } = useEnsureLogin();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const errorMessage = useMemo(() => {
    if (!address) {
      return null;
    }

    if (!isAddress(address)) {
      return "Please fill a valid address.";
    }

    const unsupportedMessage = getUnsupportedAddressMessage(address);
    if (unsupportedMessage) {
      return unsupportedMessage;
    }

    if (isSameAddress(address, realAddress)) {
      return "Cannot add your own address as a contact.";
    }

    if (contacts.some((item) => isSameAddress(item.address, address))) {
      return "This address is already in your contacts.";
    }

    return null;
  }, [address, contacts, realAddress]);

  const buttonDisabled = useMemo(() => {
    return !name.trim() || !address || !!errorMessage;
  }, [name, address, errorMessage]);

  const doSubmit = useCallback(async () => {
    if (errorMessage) {
      dispatch(newErrorToast(errorMessage));
      return;
    }

    try {
      setIsLoading(true);

      if (!(await ensureLogin())) {
        return;
      }

      const contactAddress = normalizeAddress(address) || address;
      const { error } = await nextApi.post("user/contacts", {
        name: name.trim(),
        address: contactAddress,
      });
      if (error) {
        dispatch(newErrorToast(error.message));
        return;
      }

      dispatch(newSuccessToast("Added successfully"));
      onClose();
      refresh?.();
    } catch (e) {
      dispatch(newErrorToast(e.message));
    } finally {
      setIsLoading(false);
    }
  }, [errorMessage, address, name, ensureLogin, dispatch, onClose, refresh]);

  return (
    <Popup title="Add Contact" onClose={onClose}>
      <div className="flex flex-col gap-y-4">
        <TextInputField
          title="Name"
          text={name}
          setText={setName}
          placeholder="Please fill the contact name..."
        />
        <div>
          <PopupLabel text="Address" />
          <AddressCombo
            accounts={[]}
            address={address}
            setAddress={setAddress}
            updateOnChange
            allowInvalidAddress
            placeholder="Please fill the contact address..."
          />
        </div>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      </div>
      <div className="flex gap-[8px] justify-end">
        <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
        <PrimaryButton
          loading={isLoading}
          disabled={isLoading || buttonDisabled}
          onClick={doSubmit}
        >
          Add
        </PrimaryButton>
      </div>
    </Popup>
  );
}

function ErrorMessage({ children }) {
  return (
    <GreyPanel
      style={colorStyle[PromptTypes.ERROR]}
      className="text14Medium px-4 py-2.5"
    >
      {children}
    </GreyPanel>
  );
}
