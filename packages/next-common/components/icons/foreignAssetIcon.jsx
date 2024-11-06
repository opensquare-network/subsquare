import { find } from "lodash-es";
import foreignAssets from "../assets/foreign";

export default function ForeignAssetIcon({ symbol, className = "" }) {
  const foundAsset = find(foreignAssets, { symbol });

  return foundAsset?.icon && <foundAsset.icon className={className} />;
}
