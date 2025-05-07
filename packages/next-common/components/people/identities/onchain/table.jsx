import DataList from "next-common/components/dataList";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import { defaultPageSize } from "next-common/utils/constants";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import AddressUser from "next-common/components/user/addressUser";
import columns from "../columns";

export default function OnchainIdentitiesTable({ identitieList, isLoading }) {
  const router = useRouter();
  const [total, setTotal] = useState(0);
  const {
    page,
    component: pageComponent,
    setPage,
  } = usePaginationComponent(total, defaultPageSize);

  const currentPageData = useMemo(() => {
    if (!identitieList) {
      return [];
    }

    const startIndex = (page - 1) * defaultPageSize;
    const endIndex = startIndex + defaultPageSize;

    return identitieList.slice(startIndex, endIndex);
  }, [identitieList, page]);

  useEffect(() => {
    setTotal(identitieList?.length || 0);
  }, [identitieList]);

  useEffect(() => {
    if (router.query) {
      setPage(1);
    }
  }, [router.query, setPage]);

  return (
    <div className="flex flex-col gap-y-4">
      <SecondaryCard className="space-y-2">
        <DataList
          columns={columns}
          rows={(currentPageData || [])?.map((item, index) => {
            return [
              <AddressUser key={`account-${index}`} add={item.address} />,
              <div
                key={`subsCount-${index}`}
                className="text-textPrimary text14Medium"
              >
                -
              </div>,
              <div
                key={`latestUpdate-${index}`}
                className="text-textTertiary text14Medium"
              >
                -
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
