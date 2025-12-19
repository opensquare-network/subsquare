import TreeMapDataList from "next-common/components/dataList/treeList";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import { defaultPageSize } from "next-common/utils/constants";
import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { desktopColumns, mobileColumns } from "./columns";
import { useNavCollapsed } from "next-common/context/nav";
import { cn } from "next-common/utils";
import useSearchComponent from "next-common/components/data/common/useSearchComponent";
import { useDebounce } from "react-use";

function useSearchAndPagination(identityList = []) {
  const router = useRouter();
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
  const { component: SearchBoxComponent } = useSearchComponent();

  const searchIdentityList = useMemo(() => {
    return (identityList || []).filter(
      ({ address = "", name = "" }) =>
        address === debouncedSearchValue ||
        name
          .toLocaleLowerCase()
          .includes(debouncedSearchValue.toLocaleLowerCase()),
    );
  }, [debouncedSearchValue, identityList]);
  const total = searchIdentityList.length;

  const {
    page,
    component: PageComponent,
    setPage,
  } = usePaginationComponent(total, defaultPageSize);

  useDebounce(
    () => {
      setDebouncedSearchValue(router.query.search || "");
      setPage(1);
    },
    500,
    [router.query.search],
  );

  const currentPageData = useMemo(() => {
    if (!identityList) {
      return [];
    }

    const startIndex = (page - 1) * defaultPageSize;
    const endIndex = startIndex + defaultPageSize;

    return searchIdentityList.slice(startIndex, endIndex);
  }, [identityList, page, searchIdentityList]);

  return {
    SearchBoxComponent,
    PageComponent: total > 0 ? PageComponent : null,
    currentPageData,
  };
}

export default function OnchainIdentitiesTable({ identityList, isLoading }) {
  const [navCollapsed] = useNavCollapsed();
  const { SearchBoxComponent, PageComponent, currentPageData } =
    useSearchAndPagination(identityList);

  return (
    <>
      {SearchBoxComponent}
      <div className="flex flex-col gap-y-4">
        <SecondaryCard className="space-y-2">
          <TreeMapDataList
            className={cn(navCollapsed ? "max-sm:hidden" : "max-md:hidden")}
            columnsDef={desktopColumns}
            data={currentPageData}
            loading={isLoading}
            noDataText="No identities"
            treeKey="subIdentities"
          />

          <TreeMapDataList
            className={cn(
              "hidden",
              navCollapsed ? "max-sm:block" : "max-md:block",
            )}
            columnsDef={mobileColumns}
            data={currentPageData}
            loading={isLoading}
            noDataText="No identities"
            treeKey="subIdentities"
          />
          {PageComponent}
        </SecondaryCard>
      </div>
    </>
  );
}
