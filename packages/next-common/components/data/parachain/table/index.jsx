import { mobileColumns, desktopColumns } from "./columns";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import { defaultPageSize } from "next-common/utils/constants";
import { useEffect, useMemo } from "react";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { MapDataList } from "next-common/components/dataList";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import { useRouter } from "next/router";
import { useNavCollapsed } from "next-common/context/nav";
import { cn } from "next-common/utils";
import { useParachainInfo } from "../hooks/useParaEndpoints";
import useSearchComponent from "../../common/useSearchComponent";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";

export default function ParachainExplorerTable() {
  const { search = "", component: SearchBoxComponent } = useSearchComponent({
    placeholder: "Search by parachain id or name",
  });
  const {
    loading,
    value: filterData,
    totalCount,
  } = useParachainInfo({ search });

  const router = useRouter();
  const [navCollapsed] = useNavCollapsed();

  const {
    page,
    component: pageComponent,
    setPage,
  } = usePaginationComponent(totalCount, defaultPageSize);

  const tableData = useMemo(() => {
    return filterData?.slice(
      (page - 1) * defaultPageSize,
      page * defaultPageSize,
    );
  }, [filterData, page]);

  useEffect(() => {
    if (router.query) {
      setPage(1);
    }
  }, [router.query, setPage]);

  return (
    <div className="flex flex-col gap-y-4">
      <div>
        <TitleContainer>
          <span>
            List
            <span className="text-textTertiary text16Medium ml-1">
              {!loading && totalCount}
            </span>
          </span>
        </TitleContainer>

        {SearchBoxComponent}
      </div>
      <SecondaryCard className="space-y-2">
        <ScrollerX>
          <MapDataList
            className={cn(navCollapsed ? "max-sm:hidden" : "max-md:hidden")}
            columnsDef={desktopColumns}
            data={tableData}
            loading={loading}
            noDataText="No data"
          />

          <MapDataList
            className={cn(
              "hidden",
              navCollapsed ? "max-sm:block" : "max-md:block",
            )}
            columnsDef={mobileColumns}
            data={tableData}
            loading={loading}
            noDataText="No data"
          />
        </ScrollerX>
        {totalCount > 0 && pageComponent}
      </SecondaryCard>
    </div>
  );
}
