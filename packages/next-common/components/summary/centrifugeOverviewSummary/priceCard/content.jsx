import { find, noop } from "lodash-es";
import PriceCardContentChart from "./chart";
import CardHeader from "next-common/components/overview/centrifugeStats/cardHeader";
import { cn } from "next-common/utils";
import { useBasicData } from "next-common/context/centrifuge/basicData";
import { formatBN } from "next-common/utils/bn";
import { LinkCoinmarketcap, LinkCoingecko } from "@osn/icons/subsquare";
import Loading from "next-common/components/loading";

function LinkIcon({ href, icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "[&_svg_path]:fill-textTertiary [&_svg_path]:hover:fill-textSecondary",
        "[&_svg]:w-[20px] [&_svg]:h-[20px]",
      )}
    >
      {icon}
    </a>
  );
}

function DateItem({ selected, onClick, children }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "px-[8px] py-[2px] rounded-[4px] text12Medium cursor-pointer",
        selected ? "text-theme500 bg-theme100" : "text-textSecondary",
      )}
    >
      {children}
    </div>
  );
}

export default function PriceCardContent({
  data = {},
  loading,
  range,
  setRange = noop,
  options = [],
}) {
  const { cfgPrice = 0 } = useBasicData();

  const { chartOptions = {} } = find(options, { value: range }) || {};

  return (
    <div className="grow">
      <div className="flex flex-col gap-[8px]">
        <CardHeader
          title="Token price"
          value={`$${formatBN(cfgPrice || 0, 3)}`}
        />

        <div className="flex justify-between items-center">
          <div className="flex gap-[12px]">
            <LinkIcon
              href="https://coinmarketcap.com/currencies/centrifuge/"
              icon={<LinkCoinmarketcap />}
            />
            <LinkIcon
              href="https://www.coingecko.com/en/coins/centrifuge/"
              icon={<LinkCoingecko />}
            />
          </div>

          <div className="flex gap-[8px]">
            {options.map((option) => (
              <DateItem
                key={option.value}
                selected={range === option.value}
                onClick={() => {
                  setRange(option.value);
                }}
              >
                {option.label}
              </DateItem>
            ))}
          </div>
        </div>
      </div>

      <div className={cn("relative", "mt-2")}>
        {loading && (
          <div
            className={cn(
              "absolute inset-0",
              "flex items-center justify-center",
              "bg-fillCard",
            )}
          >
            <Loading size={24} />
          </div>
        )}

        <PriceCardContentChart data={data} chartOptions={chartOptions} />
      </div>
    </div>
  );
}
