import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getRouterQuery } from "next-common/utils/router";
import { defaultPageSize } from "next-common/utils/constants";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";

export default function usePageDataFilter(sourceData, sourceLoading) {
  const router = useRouter();
  const querySearch = getRouterQuery(router, "search");
  const authority = getRouterQuery(router, "authority") || "";

  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);

  useEffect(() => {
    setLoading(true);
    const list = sourceData.filter((item) => {
      const matchSearch = querySearch
        ? item?.username?.includes(querySearch) ||
          item?.owner?.includes(querySearch)
        : true;
      return matchSearch && item?.username?.endsWith(authority);
    });
    setLoading(false);
    setList(list);
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
