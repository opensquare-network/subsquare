import DataList from "next-common/components/dataList";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import { defaultPageSize } from "next-common/utils/constants";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import TableHeader from "next-common/components/data/common/tableHeader";

export default function IdentitiesTable() {
  const router = useRouter();
  const [dataList, setDataList] = useState([]);
  const { filteredProxies, total, isLoading } = {};

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
    setDataList(filteredProxies?.slice(startIndex, endIndex));
  }, [filteredProxies, page, isLoading]);

  useEffect(() => {
    if (router.query) {
      setPage(1);
    }
  }, [router.query, setPage]);

  const columns = [
    {
      name: "Account",
    },
    {
      name: "Sub Identities",
    },
    {
      name: "Latest Update",
    },
  ];

  return (
    <div className="flex flex-col gap-y-4">
      <TableHeader showMyRelated={false} total={total} loading={isLoading} />
      <SecondaryCard className="space-y-2">
        <DataList
          columns={columns}
          rows={dataList}
          loading={isLoading}
          noDataText="No identities"
        />
        {total > 0 && pageComponent}
      </SecondaryCard>
    </div>
  );
}
