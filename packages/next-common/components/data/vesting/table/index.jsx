import { getColumns } from "./columns";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import { defaultPageSize } from "next-common/utils/constants";
import { useEffect, useState, useMemo } from "react";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import useAllVestingData from "../hooks/useAllVestingData";
import { MapDataList } from "next-common/components/dataList";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import { useRouter } from "next/router";
import TableHeader from "next-common/components/data/common/tableHeader";
import VestingDetailPopup from "../popup";
import useFilterAllVesting from "../hooks/useFilterAllVesting";

export default function NewVestingExplorerTable() {
  const { data, isLoading: loading, sortField, sortDirection, onSort } = useAllVestingData();
  const router = useRouter();
  const [dataList, setDataList] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const { filteredVesting, total, isLoading } = useFilterAllVesting(
    data,
    loading,
  );

  const {
    page,
    component: pageComponent,
    setPage,
  } = usePaginationComponent(total, defaultPageSize);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const startIndex = (page - 1) * defaultPageSize;
    const endIndex = startIndex + defaultPageSize;
    setDataList(filteredVesting?.slice(startIndex, endIndex));
  }, [filteredVesting, page, isLoading]);

  useEffect(() => {
    if (router.query) {
      setPage(1);
    }
  }, [router.query, setPage]);

  const dataListWithActions = useMemo(() => {
    return dataList?.map((item) => ({
      ...item,
      onCheckDetail: () => setSelectedAccount(item.account),
    }));
  }, [dataList]);

  const selectedData = useMemo(() => {
    if (!selectedAccount) return null;
    return data.find((item) => item.account === selectedAccount);
  }, [selectedAccount, data]);

  const columns = useMemo(() => {
    return getColumns({ sortField, sortDirection, onSort });
  }, [sortField, sortDirection, onSort]);

  return (
    <>
      <div className="flex flex-col gap-y-4">
        <TableHeader total={total} loading={isLoading} />
        <SecondaryCard className="space-y-2">
          <ScrollerX>
            <MapDataList
              columnsDef={columns}
              data={dataListWithActions}
              loading={isLoading}
              noDataText="No vesting data"
            />
          </ScrollerX>
          {total > 0 && pageComponent}
        </SecondaryCard>
      </div>

      {selectedAccount && (
        <VestingDetailPopup
          account={selectedAccount}
          data={selectedData}
          onClose={() => setSelectedAccount(null)}
        />
      )}
    </>
  );
}
