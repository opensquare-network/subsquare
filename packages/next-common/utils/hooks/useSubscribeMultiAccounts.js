import { useEffect, useState } from "react";

export default function useSubscribeMultiAccounts(query, keys) {
  const [accounts, setAccounts] = useState();

  useEffect(() => {
    if (!query || !keys) {
      setAccounts();
      return;
    }

    if (keys.length === 0) {
      setAccounts([]);
      return;
    }

    setAccounts();

    let isMounted = true;
    let unsubscribe;

    const handleUpdate = (data = []) => {
      if (!isMounted) {
        return;
      }

      setAccounts((previous = []) =>
        keys.map((_, index) =>
          data?.[index] == null ? previous[index] : data[index],
        ),
      );
    };

    query
      .multi(keys, handleUpdate)
      .then((unsub) => {
        if (isMounted) {
          unsubscribe = unsub;
        } else {
          unsub?.();
        }
      })
      .catch((error) => {
        if (isMounted) {
          console.error("Failed to subscribe accounts", error);
          setAccounts([]);
        }
      });

    return () => {
      isMounted = false;
      unsubscribe?.();
    };
  }, [keys, query]);

  return accounts;
}
