import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import useCoretimeSalePhase from "next-common/context/coretime/hooks/useCoretimeSalePhase";

function Item({ label = "", value }) {
  return (
    <div className="flex items-center gap-x-1 text12Medium text-textTertiary">
      <div>{label}</div>
      <div className="text-textPrimary">{value}</div>
    </div>
  );
}

export default function CoretimeSaleSummary({ data }) {
  const { decimals, symbol } = useChainSettings();
  const phase = useCoretimeSalePhase();
  console.log("phase", phase);

  return (
    <div>
      <SummaryLayout>
        <SummaryItem title="Current Price">
          {data?.info?.price ? (
            <ValueDisplay
              value={toPrecision(10000000000, decimals)}
              symbol={symbol}
            />
          ) : (
            <div className="text-textTertiary">-</div>
          )}
        </SummaryItem>

        <SummaryItem title="Available Cores">
          {data?.info ? (
            <div>
              {data?.info?.coresSold}
              <span className="text-textTertiary">
                {" "}
                / {data?.info?.coresOffered}
              </span>
            </div>
          ) : (
            <div className="text-textTertiary">-</div>
          )}
        </SummaryItem>

        <SummaryItem title="Current Phase">
          <div>Interlude</div>
        </SummaryItem>

        <SummaryItem title="Sale Period">
          <div>[time]</div>
        </SummaryItem>

        <SummaryItem>
          <div className="space-y-1 text12Medium text-textTertiary">
            <Item
              label="Total Revenue"
              value={
                <ValueDisplay
                  className="text-textPrimary"
                  value={toPrecision(data?.totalRevenue, decimals)}
                  symbol={symbol}
                />
              }
            />
            <Item
              label="↳ Renewal"
              value={
                <ValueDisplay
                  className="text-textPrimary"
                  value={toPrecision(data?.renewalRevenue, decimals)}
                  symbol={symbol}
                />
              }
            />
            <Item
              label="↳ Sale"
              value={
                <ValueDisplay
                  className="text-textPrimary"
                  value={toPrecision(data?.purchaseRevenue, decimals)}
                  symbol={symbol}
                />
              }
            />
          </div>
        </SummaryItem>

        <SummaryItem>
          <div className="space-y-1 text12Medium text-textTertiary">
            <Item label="System Reserved" value="[0]" />
            <Item label="Renewal" value={data?.renewalCount} />
            <Item label="Sale" value={data?.purchaseCount} />
          </div>
        </SummaryItem>

        <SummaryItem>
          <div className="text12Medium">
            <Item label="End in" value="[time]" />
          </div>
        </SummaryItem>

        <SummaryItem>
          <div className="space-y-1 text12Medium">
            <Item label="End At" value="[time]" />
          </div>
        </SummaryItem>
      </SummaryLayout>
    </div>
  );
}
