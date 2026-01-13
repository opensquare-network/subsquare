import {
  AssetID,
  Location,
} from "next-common/components/assethubMigrationAssets/foreignAssets/table/columns/id";

export const colId = {
  name: "Location & ID",
  style: { textAlign: "left", width: "150px", minWidth: "150px" },
  render: (item) => (
    <div className="flex items-center gap-x-2">
      <Location location={item?.metadata?.location} />
      <AssetID assetId={item.assetId} />
    </div>
  ),
};
