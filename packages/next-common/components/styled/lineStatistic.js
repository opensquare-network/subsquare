import { useChainSettings } from "next-common/context/chain";
import { cn, toPrecision } from "next-common/utils";
import tw from "tailwind-styled-components";
import ValueDisplay from "../valueDisplay";
import { isNil } from "lodash-es";

const LineStatistic = tw.div`
  w-full
  flex gap-x-1
  py-1.5 px-3 rounded
  max-sm:flex-wrap
  bg-neutral200
  scrollbar-hidden overflow-x-scroll
`;

export default LineStatistic;

export function LineStatisticItem({ label = "", value }) {
  return <Item label={label}>{value}</Item>;
}

export function LineStatisticDecimalsItem({ label = "", value, percentage }) {
  return (
    <Item label={label}>
      <ItemValue value={value} percentage={percentage} />
    </Item>
  );
}

function ItemValue({ value, percentage }) {
  const { decimals } = useChainSettings();

  if (isNil(percentage)) {
    return <ValueDisplay value={toPrecision(value, decimals)} />;
  }

  return (
    <>
      {(percentage || 0).toFixed(2)}% (
      <ValueDisplay value={toPrecision(value, decimals)} />)
    </>
  );
}

function Item({ label = "", children }) {
  return (
    <div
      className={cn(
        "flex items-center gap-x-1 text12Medium text-textTertiary",
        "before:content-['·'] before:mx-1 before:first:hidden",
      )}
    >
      <div className="whitespace-nowrap">{label}</div>
      <div className="text-textSecondary flex whitespace-nowrap items-center">
        {children}
      </div>
    </div>
  );
}
