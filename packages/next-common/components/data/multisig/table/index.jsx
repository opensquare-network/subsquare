import { desktopColumns, mobileColumns } from "./columns";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import { defaultPageSize } from "next-common/utils/constants";
import { useEffect, useMemo, useState } from "react";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import useQueryAllMultisigData from "next-common/components/data/multisig/hooks/useQueryAllMultisigData";
import { MapDataList } from "next-common/components/dataList";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import { useRouter } from "next/router";
import useSearchComponent from "../../common/useSearchComponent";
import useQueryTypeSelect from "../../common/useQueryTypeSelect";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { useNavCollapsed } from "next-common/context/nav";
import { cn } from "next-common/utils";
import { isNil } from "lodash-es";
import { addRouterQuery } from "next-common/utils/router";
import { CallPopupInContext } from "next-common/components/multisigs/callPopup";

export default function MultisigExplorerTable() {
  const [navCollapsed] = useNavCollapsed();
  const router = useRouter();
  const [dataList, setDataList] = useState([]);
  const { search = "", component: SearchBoxComponent } = useSearchComponent({
    placeholder: "Address",
    className: "h-7 my-0",
    size: "small",
  });
  const { queryType, component: QueryTypeSelectComponent } =
    useQueryTypeSelect("account");
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const { page, component: pageComponent } = usePaginationComponent(
    totalCount,
    defaultPageSize,
  );

  const { data, loading: isLoading } = useQueryAllMultisigData({
    search,
    queryType,
    offset: (page - 1) * defaultPageSize,
    limit: defaultPageSize,
  });

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
    setDataList(data?.multisigs?.filter(Boolean));
    setLoading(false);
  }, [data, isLoading, total]);

  useEffect(() => {
    addRouterQuery(router, "page", 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.search]);

  useEffect(() => {
    addRouterQuery(router, "page", page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (!router.query.search) {
      return;
    }

    addRouterQuery(router, "page", 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryType]);

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
          <div className="flex flex-row items-center gap-y-4">
            {QueryTypeSelectComponent}
            {SearchBoxComponent}
          </div>
        </TitleContainer>
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
      <CallPopupInContext />
    </div>
  );
}
