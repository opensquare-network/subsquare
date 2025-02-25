import { desktopColumns, mobileColumns } from "./columns";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import { defaultPageSize } from "next-common/utils/constants";
import { useEffect, useMemo, useState } from "react";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import useQueryAllMultisigData from "next-common/components/data/multisig/hooks/useQueryAllMultisigData";
import { MapDataList } from "next-common/components/dataList";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import { useRouter } from "next/router";
import useMyRelatedSwitch from "../../common/useMyRelatedSwitch";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useSearchComponent from "../../common/useSearchComponent";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { useNavCollapsed } from "next-common/context/nav";
import { cn } from "next-common/utils";
import { isNil } from "lodash-es";

export default function MultisigExplorerTable() {
  const [navCollapsed] = useNavCollapsed();
  const router = useRouter();
  const [dataList, setDataList] = useState([]);
  // component: MyRelatedSwitchComponent
  const { isOn: isMyRelated } = useMyRelatedSwitch();
  const { search = "", component: SearchBoxComponent } = useSearchComponent({
    isMyRelated,
    placeholder: "Search by address",
  });
  const userAddress = useRealAddress();
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const {
    page,
    component: pageComponent,
    setPage,
  } = usePaginationComponent(totalCount, defaultPageSize);

  const searchAccount = useMemo(() => {
    return isMyRelated ? userAddress : search;
  }, [isMyRelated, userAddress, search]);

  const { data, loading: isLoading } = useQueryAllMultisigData(
    searchAccount,
    (page - 1) * defaultPageSize,
    defaultPageSize,
  );

  const total = useMemo(() => {
    if (data?.offset === 0 && data?.multisigs.length === 0) {
      return 0;
    }
    return data?.total || 0;
  }, [data]);

  useEffect(() => {
    setLoading(true);
  }, [page]);

  useEffect(() => {
    if (isLoading || isNil(data)) {
      return;
    }

    setTotalCount(total);
    setDataList(data?.multisigs);
    setLoading(false);
  }, [data, isLoading, total]);

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
              {!loading && total}
            </span>
          </span>
          {/* {MyRelatedSwitchComponent} */}
        </TitleContainer>
        {SearchBoxComponent}
      </div>
      <SecondaryCard className="space-y-2">
        <ScrollerX>
          <MapDataList
            className={cn(navCollapsed ? "max-sm:hidden" : "max-md:hidden")}
            columnsDef={desktopColumns}
            data={dataList}
            loading={loading}
            noDataText="No data"
          />

          <MapDataList
            className={cn(
              "hidden",
              navCollapsed ? "max-sm:block" : "max-md:block",
            )}
            columnsDef={mobileColumns}
            data={dataList}
            loading={loading}
            noDataText="No data"
          />
        </ScrollerX>
        {total > 0 && pageComponent}
      </SecondaryCard>
    </div>
  );
}
