import { MapDataList } from "next-common/components/dataList";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
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

  return (
    <SecondaryCard>
      <MapDataList
        columnsDef={columnsDef}
        data={regions}
        getRowKey={(region) => `${region.begin}-${region.core}-${region.mask}`}
        loading={loading}
        noDataText="No regions"
      />
    </SecondaryCard>
  );
}
