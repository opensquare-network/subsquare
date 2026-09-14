import { useState } from "react";
import { useRouter } from "next/router";
import dynamicPopup from "next-common/lib/dynamic/popup";
import DataList from "next-common/components/dataList";
import ListTitleBar from "next-common/components/listTitleBar";
import { ListWrapper } from "next-common/components/postList/styled";
import { MineTagOnListView } from "next-common/components/delegation/delegate/common/mineTag";
import { isSameAddress } from "next-common/utils";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useRegionColumns from "./columns";
import useRegions from "./useRegions";
import { RegionTimeProvider } from "./context";
import RegionFilter from "./filter";
import { RegionStatus } from "./utils";

const actionPopups = {
  details: dynamicPopup(() => import("./detailPopup")),
  assign: dynamicPopup(() => import("./assignPopup")),
  pool: dynamicPopup(() => import("./poolPopup")),
  transfer: dynamicPopup(() => import("./transferPopup")),
  partition: dynamicPopup(() => import("./partitionPopup")),
  interlace: dynamicPopup(() => import("./interlacePopup")),
};

export default function CoretimeRegions() {
  return (
    <RegionTimeProvider>
      <CoretimeRegionsContent />
    </RegionTimeProvider>
  );
}

function CoretimeRegionsContent() {
  const router = useRouter();
  const [activeAction, setActiveAction] = useState(null);
  const columnsDef = useRegionColumns(setActiveAction);
  const ActionPopup = actionPopups[activeAction?.action];
  const { regions, loading } = useRegions();
  const realAddress = useRealAddress();
  const status =
    Object.values(RegionStatus).find(
      (status) => status.toLowerCase() === router.query.status,
    ) || "";
  const filter = {
    status,
    includeExpired:
      router.query.include_expired === "true" ||
      status === RegionStatus.Expired,
  };

  const handleFilterChange = (value) => {
    const query = { ...router.query };
    delete query.status;
    delete query.include_expired;
    if (value.status) {
      query.status = value.status.toLowerCase();
    }
    if (value.includeExpired) {
      query.include_expired = "true";
    }
    return router.replace({ pathname: router.pathname, query }, undefined, {
      shallow: true,
      scroll: false,
    });
  };

  const filteredRegions = regions.filter(
    (region) =>
      (filter.includeExpired || region.status !== RegionStatus.Expired) &&
      (!filter.status || region.status === filter.status),
  );

  const rows = filteredRegions.map((region) => {
    const row = columnsDef.map(({ render }) => render(region));
    row.key = `${region.begin}-${region.core}-${region.mask}`;

    if (isSameAddress(region.owner, realAddress)) {
      row.tag = <MineTagOnListView />;
    }

    return row;
  });

  return (
    <ListWrapper>
      <ListTitleBar
        title="List"
        titleCount={loading ? null : String(rows.length)}
        titleExtra={
          <RegionFilter value={filter} onChange={handleFilterChange} />
        }
      />
      <DataList
        bordered
        columns={columnsDef}
        rows={rows}
        loading={loading}
        noDataText="No regions"
      />
      {ActionPopup && (
        <ActionPopup
          region={activeAction.region}
          onClose={() => setActiveAction(null)}
        />
      )}
    </ListWrapper>
  );
}
