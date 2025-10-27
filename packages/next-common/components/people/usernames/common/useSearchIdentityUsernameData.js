import { useContextApi } from "next-common/context/api";
import { hexToString } from "@polkadot/util";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getRouterQuery } from "next-common/utils/router";
import { defaultPageSize } from "next-common/utils/constants";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";

export function useIdentityUsernameInfoOf() {
  const api = useContextApi();
  const [loading, setLoading] = useState(true);
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
      .catch(console.error)
      .finally(() => {
        setLoading(false);
      });
  }, [api]);
  return { loading, data };
}

export default function useSearchIdentityUsernameData() {
  const router = useRouter();
  const querySearch = getRouterQuery(router, "search");
  const authority = getRouterQuery(router, "authority") || "";

  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);

  const { data: sourceData, loading: sourceLoading } =
    useIdentityUsernameInfoOf();

  useEffect(() => {
    setLoading(true);
    const searchLower = querySearch?.toLowerCase();

    const list = sourceData.filter((item) => {
      const matchSearch = querySearch
        ? item?.username?.toLowerCase().includes(searchLower) ||
          item?.owner?.toLowerCase().includes(searchLower)
        : true;

      const matchAuthority = authority
        ? item?.username?.endsWith(authority)
        : true;

      return matchSearch && matchAuthority;
    });

    setLoading(false);
    setList(list.sort((a, b) => a.username?.localeCompare(b.username)));
  }, [authority, querySearch, sourceData]);

  const {
    page,
    component: pageComponent,
    setPage,
  } = usePaginationComponent(list.length, defaultPageSize);

  useEffect(() => {
    setPage(1);
  }, [list, setPage]);

  return {
    loading: loading || sourceLoading,
    data: list.slice(
      (page - 1) * defaultPageSize,
      (page - 1) * defaultPageSize + defaultPageSize,
    ),
    total: list.length,
    pageComponent,
  };
}
