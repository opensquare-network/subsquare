import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";

function Item({ label, value }) {
  return (
    <div className="flex items-center gap-x-1 text12Medium text-textTertiary">
      <div>{label}</div>
      <div className="text-textPrimary">{value}</div>
    </div>
  );
}

export default function CoretimeSaleSummary({ data }) {
  const { decimals, symbol } = useChainSettings();

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
          <div>52</div>
        </SummaryItem>

        <SummaryItem title="Current Phase">
          <div>Interlude Phase</div>
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
            <Item label="System Reserved" value={0} />
            <Item label="Leased" value={0} />
            <Item label="Renewal" value={4} />
          </div>
        </SummaryItem>

        <SummaryItem>
          <div className="text12Medium">
            <div>End in [time]</div>
          </div>
        </SummaryItem>

        <SummaryItem>
          <div className="space-y-1 text12Medium">
            <div>Start Block: [block]</div>
            <div>End Block: [block]</div>
          </div>
        </SummaryItem>
      </SummaryLayout>
    </div>
  );
}
