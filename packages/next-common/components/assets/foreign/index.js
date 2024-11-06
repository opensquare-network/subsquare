import dynamic from "next/dynamic";

const AssetIconMyth = dynamic(() =>
  import("@osn/icons/subsquare/AssetIconMyth"),
);

const foreignAssets = [
  {
    symbol: "MYTH",
    assetId: null, // Foreign Asset
    icon: AssetIconMyth,
  },
];

export default foreignAssets;
