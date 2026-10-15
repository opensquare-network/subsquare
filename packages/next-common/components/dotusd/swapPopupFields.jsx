import { isNil } from "lodash-es";
import { toPrecision } from "next-common/utils";
import PopupLabel from "next-common/components/popup/label";
import Select from "next-common/components/select";
import CurrencyInput from "next-common/components/currencyInput";
import TokenIcon from "next-common/components/assethubMigrationAssets/swap/components/tokenIcon";
import ValueDisplay from "next-common/components/valueDisplay";
import { isRoundedAmount, permillToPercent } from "./psmUtils";

// One asset as a Select option. The label is what the dropdown searches on, so it carries the
// id too; displayValue is what the closed field shows.
function buildAssetOption(asset, { disabled } = {}) {
  return {
    value: asset.index,
    label: `${asset.symbol} #${asset.index}`,
    displayValue: (
      <span className="inline-flex items-center gap-x-2">
        <span>{asset.symbol}</span>
        <span className="text-textTertiary">{`#${asset.index}`}</span>
      </span>
    ),
    icon: <TokenIcon token={{ assetId: asset.index, symbol: asset.symbol }} />,
    disabled,
  };
}

function AssetSelectField({ label, options, value, onChange, readOnly }) {
  return (
    <div>
      <PopupLabel text={label} />
      <Select
        value={value}
        options={options}
        onChange={onChange}
        readOnly={readOnly}
        placeholder="Select an asset"
      />
    </div>
  );
}

/**
 * The external asset field of both swap popups. With a single approved asset there is nothing
 * to choose, so it renders read only and the pair still shows; with several it becomes a
 * dropdown.
 *
 * `isEnabled` is what differs between the directions: minting needs AllEnabled, while
 * redemption survives the middle circuit breaker state and only stops at AllDisabled.
 */
export function ExternalAssetSelect({
  label,
  externals = [],
  external,
  onChange,
  isEnabled,
}) {
  const options = externals.map((item) =>
    buildAssetOption(item, {
      // An asset the breaker has stopped stays listed so its state is visible, but it cannot
      // be picked.
      disabled: !isEnabled(item),
    }),
  );

  return (
    <AssetSelectField
      label={label}
      value={external?.index}
      options={options}
      onChange={(item) => onChange(item.value)}
      readOnly={externals.length <= 1}
    />
  );
}

/**
 * The asset field of a popup whose asset is fixed, like the dotUSD transfer: the same field as
 * the swap popups', held read only, so the asset they would let you pick is shown the same way.
 */
export function ReadOnlyAssetField({ label = "Asset", asset }) {
  return (
    <AssetSelectField
      label={label}
      value={asset?.index}
      options={isNil(asset?.index) ? [] : [buildAssetOption(asset)]}
      readOnly
    />
  );
}

/**
 * A planck amount in a summary row. The empty state is a bare hyphen that inherits the row's
 * value styling, like the swap summary's: an em dash in a lighter colour reads as a stray
 * glyph bigger than the numbers it stands in for.
 *
 * The "≈" is decided here rather than left to ValueDisplay, which only marks the roundings its
 * own abbreviation notices — see isRoundedAmount. ValueDisplay keeps the full value in its
 * tooltip either way.
 */
export function SwapAmountValue({ value, decimals, symbol }) {
  if (isNil(value)) {
    return "-";
  }

  const rounded = isRoundedAmount(value, decimals);

  return (
    <span className="inline-flex items-center gap-x-1">
      {rounded && <span>≈</span>}
      <ValueDisplay
        value={toPrecision(value.toString(), decimals)}
        symbol={symbol}
        showApproximationSymbol={false}
      />
    </span>
  );
}

/**
 * The max fee a swap will accept, read only. It is the pair's own fee floored at 0.1%, so it
 * is always something the chain accepts — see resolveMaxFeePermill.
 */
export function MaxFeeField({ maxFeePermill }) {
  return (
    <div>
      <PopupLabel
        text="Max fee"
        tooltip="The highest fee this swap accepts. The chain rejects it if the fee has risen above this by the time it runs."
        tooltipContentClassName="max-w-[260px]"
      />
      <CurrencyInput
        disabled
        value={permillToPercent(maxFeePermill).toString()}
        symbol="%"
      />
    </div>
  );
}
