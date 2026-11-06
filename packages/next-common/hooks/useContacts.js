import { useCallback, useEffect, useState } from "react";
import nextApi from "next-common/services/nextApi";

export default function useContacts(isLoggedIn) {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchContacts = useCallback(async () => {
    if (!isLoggedIn) {
      setContacts([]);
      return;
    }

    try {
      setIsLoading(true);
      const { result } = await nextApi.fetch("user/contacts");
      setContacts(result || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  return {
    contacts,
    isLoading,
    refresh: fetchContacts,
  };
}
