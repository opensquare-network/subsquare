import DataList from "next-common/components/dataList";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import { defaultPageSize } from "next-common/utils/constants";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import usePeopleChainIdentityList from "next-common/hooks/people/usePeopleChainIdentityList";
import AddressUser from "next-common/components/user/addressUser";
import { useDebounce } from "react-use";
const columns = [
  {
    name: "Who",
  },
  {
    name: "Status",
    width: 160,
  },
];

export default function IdentitiesTable() {
  const router = useRouter();
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
  const [total, setTotal] = useState(0);
  const {
    page,
    component: pageComponent,
    setPage,
  } = usePaginationComponent(total, defaultPageSize);
  const { data, isLoading } = usePeopleChainIdentityList({
    page,
    search: debouncedSearchValue,
  });
  const identitieList = useMemo(() => data?.identities ?? [], [data]);

  useDebounce(
    () => {
      setDebouncedSearchValue(router.query.search);
    },
    500,
    [router.query.search],
  );

  useEffect(() => {
    setTotal(data?.total || 0);
  }, [data]);

  useEffect(() => {
    if (router.query) {
      setPage(1);
    }
  }, [router.query, setPage]);

  return (
    <div className="flex flex-col gap-y-4">
      <DataList
        columns={columns}
        rows={identitieList.map((item, index) => {
          return [
            <AddressUser key={`account-${index}`} add={item.account} />,
            <div
              key={`subsCount-${index}`}
              className="text-textPrimary text14Medium"
            >
              {item.subsCount}
            </div>,
          ];
        })}
        loading={isLoading}
        noDataText="No identities"
      />
      {total > 0 && pageComponent}
    </div>
  );
}
