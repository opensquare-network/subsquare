import {
  Location,
  AssetID,
} from "next-common/components/assethubMigrationAssets/foreignAssets/table/columns/id";

export const colId = {
  name: "Location & ID",
  style: { textAlign: "left", width: "160px", minWidth: "160px" },
  render: (item) => (
    <div className="flex items-center gap-x-2">
      <Location location={item.location} />
      <AssetID assetId={item.assetId} />
    </div>
  ),
};
