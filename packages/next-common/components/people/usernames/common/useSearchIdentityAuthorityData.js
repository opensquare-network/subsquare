import { useContextApi } from "next-common/context/api";
import { hexToString } from "@polkadot/util";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getRouterQuery } from "next-common/utils/router";
import { defaultPageSize } from "next-common/utils/constants";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";

export default function useSearchIdentityAuthorityData() {
  const router = useRouter();
  const querySearch = getRouterQuery(router, "search");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { data: sourceData, loading: sourceLoading } =
    useIdentityAuthorityData();

  useEffect(() => {
    setLoading(true);
    const searchLower = querySearch?.toLowerCase();

    const list = sourceData.filter((item) => {
      return querySearch
        ? item?.username?.toLowerCase().includes(searchLower) ||
            item?.accountId?.toLowerCase().includes(searchLower)
        : true;
    });

    setLoading(false);
    setList(list);
  }, [querySearch, sourceData]);

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

export function useIdentityAuthorityData() {
  const api = useContextApi();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!api) return;
    setLoading(true);
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
      .catch(console.error)
      .finally(() => {
        setLoading(false);
      });
  }, [api]);
  return { loading, data };
}
