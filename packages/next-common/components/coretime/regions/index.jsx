import DataList from "next-common/components/dataList";
import { MineTagOnListView } from "next-common/components/delegation/delegate/common/mineTag";
import { isSameAddress } from "next-common/utils";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useRegionColumns from "./columns";
import useRegions from "./useRegions";
import { RegionTimeProvider } from "./context";

export default function CoretimeRegions() {
  return (
    <RegionTimeProvider>
      <CoretimeRegionsContent />
    </RegionTimeProvider>
  );
}

function CoretimeRegionsContent() {
  const columnsDef = useRegionColumns();
  const { regions, loading } = useRegions();
  const realAddress = useRealAddress();

  const sortedRegions = [...regions].sort(
    (a, b) =>
      Number(isSameAddress(b.owner, realAddress)) -
      Number(isSameAddress(a.owner, realAddress)),
  );

  const rows = sortedRegions.map((region) => {
    const row = columnsDef.map(({ render }) => render(region));
    row.key = `${region.begin}-${region.core}-${region.mask}`;

    if (isSameAddress(region.owner, realAddress)) {
      row.tag = <MineTagOnListView />;
    }

    return row;
  });

  return (
    <DataList
      bordered
      columns={columnsDef}
      rows={rows}
      loading={loading}
      noDataText="No regions"
    />
  );
}
