import DataList from "next-common/components/dataList";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import { defaultPageSize } from "next-common/utils/constants";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import TableHeader from "next-common/components/data/common/tableHeader";
import usePeopleChainIdentityList from "next-common/hooks/people/usePeopleChainIdentityList";
import AddressUser from "next-common/components/user/addressUser";
import dayjs from "dayjs";
import { useDebounce } from "react-use";
const columns = [
  {
    name: "Account",
  },
  {
    name: "Sub Identities",
    width: 160,
  },
  {
    name: "Latest Update",
    width: 200,
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
      <TableHeader showMyRelated={false} total={total} loading={isLoading} />
      <SecondaryCard className="space-y-2">
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
              <div
                key={`latestUpdate-${index}`}
                className="text-textTertiary text14Medium"
              >
                {dayjs(item.latestUpdate).format("YYYY-MM-DD HH:mm:ss")}
              </div>,
            ];
          })}
          loading={isLoading}
          noDataText="No identities"
        />
        {total > 0 && pageComponent}
      </SecondaryCard>
    </div>
  );
}
