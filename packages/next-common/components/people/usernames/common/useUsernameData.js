import { useContextApi } from "next-common/context/api";
import { hexToString } from "@polkadot/util";
import { useEffect, useState } from "react";

export function useIdentityUsernameInfoOf() {
  const api = useContextApi();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!api) return;
    setLoading(true);
    api.query.identity.usernameInfoOf
      .entries()
      .then((list) => {
        const usernameList = list?.map(([key, value]) => {
          const username = hexToString(key.args[0].toString());
          const { owner, provider } = value.unwrap();

          return {
            username,
            owner: owner?.toString(),
            provider: provider?.toString(),
          };
        });
        setData(usernameList);
      })
      .finally(() => {
        setLoading(false);
      })
      .catch(console.error);
  }, [api]);
  return { loading, data };
}

export function useIdentityAuthorityOf() {
  const api = useContextApi();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!api) return;
    api.query.identity.authorityOf
      .entries()
      .then((res) => {
        const list = res.map(([key, value]) => {
          const username = hexToString(key.args[0].toString());
          const { accountId, allocation } = value.unwrap();
          return {
            username,
            accountId: accountId?.toString(),
            allocation: allocation?.toString(),
          };
        });
        setData(list);
      })
      .finally(() => {
        setLoading(false);
      })
      .catch(console.error);
  }, [api]);
  return { loading, data };
}
