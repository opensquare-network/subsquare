import { MobileTable, tableColumns } from "./columns";
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
import { SystemLoading } from "@osn/icons/subsquare";

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
        {loading ? (
          <SystemLoading className="w-5 h-5 mt-4 mb-2 mx-auto [&_path]:stroke-textDisabled" />
        ) : (
          <>
            <ScrollerX className="hidden md:block">
              <MapDataList
                className={cn(navCollapsed ? "max-sm:hidden" : "max-md:hidden")}
                columnsDef={tableColumns}
                data={tableData}
                noDataText="No data"
              />
            </ScrollerX>
            <div className="md:hidden">
              <MobileTable tableData={tableData} />
            </div>
            {totalCount > 0 && pageComponent}
          </>
        )}
      </SecondaryCard>
    </div>
  );
}
