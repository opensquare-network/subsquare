import { noop } from "lodash-es";
import { createContext, useContext } from "react";
import { useIsLoggedIn } from "next-common/context/user";
import useContacts from "next-common/hooks/useContacts";

export const ContactsContext = createContext({
  contacts: [],
  refresh: noop,
  isLoading: false,
  isLoggedIn: false,
});

export function ContactsProvider({ children }) {
  const isLoggedIn = useIsLoggedIn();
  const { contacts, isLoading, refresh } = useContacts(isLoggedIn);

  return (
    <ContactsContext.Provider
      value={{ contacts, refresh, isLoading, isLoggedIn }}
    >
      {children}
    </ContactsContext.Provider>
  );
}

export function useContactsContext() {
  return useContext(ContactsContext);
}
