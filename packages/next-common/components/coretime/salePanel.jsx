import { useChainSettings } from "next-common/context/chain";
import { NeutralPanel } from "../styled/containers/neutralPanel";
import Divider from "../styled/layout/divider";
import SummaryItem from "../summary/layout/item";
import SummaryLayout from "../summary/layout/layout";
import ValueDisplay from "../valueDisplay";
import { toPrecision } from "next-common/utils";

export default function CoretimeSalePanel() {
  const { decimals, symbol } = useChainSettings();

  return (
    <NeutralPanel className="p-6 text-textPrimary">
      <h3 className="text16Bold">Coretime Sale #1</h3>
      <Divider className="my-4" />
      <SummaryLayout>
        <SummaryItem title="Current Price">
          <ValueDisplay
            value={toPrecision(10000000000, decimals)}
            symbol={symbol}
          />
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
        <SummaryItem />
        <SummaryItem>
          <div className="space-y-1 text12Medium">
            <div>System Reserved 0</div>
            <div>Leased 0</div>
            <div>Renewal 4</div>
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

      <hr className="border-dashed border-neutral300 my-4" />

      <div className="h-48 bg-neutral200">
        <div className="flex justify-center items-center h-full">chart</div>
      </div>
    </NeutralPanel>
  );
}
