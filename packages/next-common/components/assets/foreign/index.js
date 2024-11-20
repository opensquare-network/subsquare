import dynamic from "next/dynamic";

const AssetIconMyth = dynamic(() =>
  import("@osn/icons/subsquare/AssetIconMyth"),
);

const foreignAssets = [
  {
    symbol: "MYTH",
    icon: AssetIconMyth,
  },
];

export default foreignAssets;
