import DataList from "next-common/components/dataList";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import { defaultPageSize } from "next-common/utils/constants";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import AddressUser from "next-common/components/user/addressUser";
import { useDebounce } from "react-use";
import { noop } from "lodash-es";
import AddressDisplay from "next-common/components/user/addressDisplay";
import useSubscribeMySubIdentities from "next-common/hooks/people/useSubscribeMySubIdentities";

const columns = [
  {
    name: "Identity",
    width: 240,
  },
  {
    name: "Name",
    width: 240,
  },
  {
    name: "Address",
  },
];

export default function SubIdentitiesTable() {
  const router = useRouter();
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
  const [total, setTotal] = useState(0);
  const { subs, isLoading } = useSubscribeMySubIdentities();

  const {
    page,
    component: pageComponent,
    setPage,
  } = usePaginationComponent(total, defaultPageSize);
  noop({
    page,
    search: debouncedSearchValue,
  });
  const subList = useMemo(() => subs ?? [], [subs]);

  useDebounce(
    () => {
      setDebouncedSearchValue(router.query.search);
    },
    500,
    [router.query.search],
  );

  useEffect(() => {
    setTotal(subs?.length || 0);
  }, [subs]);

  useEffect(() => {
    if (router.query) {
      setPage(1);
    }
  }, [router.query, setPage]);

  return (
    <div className="flex flex-col gap-y-4">
      <DataList
        columns={columns}
        rows={subList.map((item, index) => {
          return [
            <AddressUser key={`Identity-${index}`} add={item.account} />,
            <div
              key={`Name-${index}`}
              className="text-textPrimary text14Medium"
            >
              {item.subsCount}
            </div>,
            <div
              key={`Address-${index}`}
              className="text-textTertiary text14Medium"
            >
              <AddressDisplay add={item.account} />
            </div>,
          ];
        })}
        loading={isLoading}
        noDataText="No sub identities"
      />
      {total > 0 && pageComponent}
    </div>
  );
}
