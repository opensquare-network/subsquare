import DataList from "next-common/components/dataList";
import { memo, useMemo, useState } from "react";
import PrimaryButton from "next-common/lib/button/primary";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { GreyPanel } from "../styled/containers/greyPanel";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import { ContactAccount } from "./styled";
import RemoveContactButton from "./removeContactButton";
import { useContactsContext } from "./context/contactsContext";
import { MAX_CONTACTS } from "./constants";

const AddContactPopup = dynamicPopup(() => import("./addContactPopup"));

const columns = [
  {
    name: "Contact",
  },
];

const ContactsTable = memo(function ContactsTable({ contacts, isLoading }) {
  const rows = useMemo(() => {
    return contacts.map((contact) => [
      <div
        key="contact"
        className="w-full flex items-center justify-between gap-x-4"
      >
        <ContactAccount contact={contact} />
        <RemoveContactButton contact={contact} />
      </div>,
    ]);
  }, [contacts]);

  const isEmpty = contacts.length === 0 && !isLoading;
  if (isEmpty) {
    return <ListEmpty />;
  }

  return (
    <DataList noDataText="" columns={columns} rows={rows} loading={isLoading} />
  );
});

export default function ContactsList() {
  const { contacts = [], isLoading, isLoggedIn } = useContactsContext();

  if (!isLoggedIn) {
    return <LoginPrompt />;
  }

  return (
    <div className="flex flex-col gap-y-4">
      <ContactsTable
        contacts={contacts}
        isLoading={isLoading && contacts.length === 0}
      />
      <AddContactLimitHint count={contacts.length} />
      <AddContactButton disabled={contacts.length >= MAX_CONTACTS} />
    </div>
  );
}

function AddContactButton({ disabled = false }) {
  const [popupOpen, setPopupOpen] = useState(false);

  return (
    <>
      <div className="flex justify-end">
        <PrimaryButton disabled={disabled} onClick={() => setPopupOpen(true)}>
          Add Contact
        </PrimaryButton>
      </div>
      {popupOpen && <AddContactPopup onClose={() => setPopupOpen(false)} />}
    </>
  );
}

function AddContactLimitHint({ count }) {
  if (count < MAX_CONTACTS) {
    return null;
  }

  return (
    <div className="text12Medium text-textTertiary text-right">
      {`You can keep at most ${MAX_CONTACTS} contacts.`}
    </div>
  );
}

function LoginPrompt() {
  const { ensureLogin, loading } = useEnsureLogin();

  return (
    <div className="flex flex-col items-center gap-y-4 py-6">
      <span className="text14Medium text-textSecondary">
        Please sign in with your wallet to manage your contacts.
      </span>
      <PrimaryButton loading={loading} onClick={ensureLogin}>
        Sign in
      </PrimaryButton>
    </div>
  );
}

function ListEmpty() {
  return (
    <GreyPanel className="px-4 py-2.5 text14Medium text-textSecondary">
      You have no contacts.
    </GreyPanel>
  );
}
