import {
  AssetID,
  Location,
} from "next-common/components/assets/foreignAssets/table/columns/id";

export const colId = {
  name: "ID",
  style: { textAlign: "left", width: "120px", minWidth: "120px" },
  render: (item) => (
    <div className="flex items-center justify-between w-[110px]">
      <AssetID assetId={item.assetId} />
      <Location location={item?.metadata?.location} />
    </div>
  ),
};
