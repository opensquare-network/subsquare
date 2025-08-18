import { useChainSettings } from "next-common/context/chain";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import Tag from "next-common/components/tags/state/tag";
import Divider from "next-common/components/styled/layout/divider";
import ValueDisplay from "next-common/components/valueDisplay";

export default function Overview() {
  const chainSettings = useChainSettings();
  const symbol = chainSettings.symbol;
  return (
    <NeutralPanel className="p-12">
      <div className="flex gap-x-1">
        <SummaryLayout>
          <SummaryItem title="Index">
            <span className="text16Bold">4</span>
          </SummaryItem>
        </SummaryLayout>
        <div>
          <Tag state="active">Active</Tag>
        </div>
      </div>
      <Divider className="my-3" />
      <div className="flex gap-x-1">
        <SummaryLayout>
          <SummaryItem title="Delegates">
            <span className="text16Bold">6</span>
          </SummaryItem>
          <SummaryItem title="W3F Delegation">
            <div className="flex flex-col gap-y-1">
              <ValueDisplay value={100} symbol={symbol} />
              <span className="text-textSecondary text12Medium">
                1M {symbol}*6x per DV
              </span>
            </div>
          </SummaryItem>
          <SummaryItem title="Participation">
            <div className="flex flex-col gap-y-1">
              <span>82.14%</span>
              <span className="text-textSecondary text12Medium">333/362</span>
            </div>
          </SummaryItem>
          <SummaryItem title="Tenure">
            <div className="flex flex-col gap-y-1">
              <div className="flex items-center gap-x-1">
                <span>4</span>
                <span className="text-textTertiary">mos</span>
              </div>
              <span className="text-textSecondary text12Medium hidden max-sm:inline-block before:content-['Start'] before:mr-1 before:text-textTertiary">
                2024-12-15
              </span>
              <span className="text-textSecondary text12Medium hidden max-sm:inline-block before:content-['End'] before:mr-1 before:text-textTertiary">
                2024-12-15
              </span>
            </div>
          </SummaryItem>
          <SummaryItem title="Start Time">
            <div className="flex flex-col gap-y-1">
              <div className="flex items-center gap-x-1 max-sm:flex-col">
                <span>2025-04-15</span>
                <span className="text-textTertiary self-start">13:56:24</span>
              </div>
              <span className="text-textSecondary text12Medium">
                #6,229,278
              </span>
            </div>
          </SummaryItem>
          <SummaryItem title="End Time">
            <div className="flex flex-col gap-y-1">
              <div className="flex items-center gap-x-1 max-sm:flex-col">
                <span>2025-04-15</span>
                <span className="text-textTertiary self-start">13:56:24</span>
              </div>
              <span className="text-textSecondary text12Medium">
                #6,229,278
              </span>
            </div>
          </SummaryItem>
        </SummaryLayout>
      </div>
    </NeutralPanel>
  );
}
