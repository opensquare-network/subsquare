import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import nextApi from "next-common/services/nextApi";
import { newErrorToast } from "next-common/store/reducers/toastSlice";

export default function useContacts(isLoggedIn) {
  const dispatch = useDispatch();
  const [contacts, setContacts] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const requestIdRef = useRef(0);

  const invalidatePendingRequests = useCallback(() => {
    requestIdRef.current++;
  }, []);

  const fetchContacts = useCallback(
    async ({ signal } = {}) => {
      const requestId = ++requestIdRef.current;

      if (!isLoggedIn) {
        setContacts([]);
        setIsFetching(false);
        setHasLoaded(false);
        return;
      }

      setIsFetching(true);
      try {
        const { result, error } = await nextApi.fetch(
          "user/contacts",
          {},
          { signal },
        );
        if (requestId !== requestIdRef.current) {
          return;
        }
        if (error) {
          // Keep the contacts already loaded instead of showing an empty list
          throw new Error(
            error.status === 401
              ? "Please sign in to load contacts"
              : error.message,
          );
        }
        setContacts(result || []);
      } catch (e) {
        if (requestId !== requestIdRef.current) {
          return;
        }
        dispatch(newErrorToast(e.message || "Failed to load contacts"));
      } finally {
        if (requestId === requestIdRef.current) {
          setIsFetching(false);
          setHasLoaded(true);
        }
      }
    },
    [isLoggedIn, dispatch],
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchContacts({ signal: controller.signal });

    return () => {
      controller.abort();
      invalidatePendingRequests();
    };
  }, [fetchContacts, invalidatePendingRequests]);

  return {
    contacts,
    isLoading: isFetching || (isLoggedIn && !hasLoaded),
    refresh: fetchContacts,
  };
}
