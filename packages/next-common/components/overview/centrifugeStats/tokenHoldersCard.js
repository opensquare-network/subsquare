import CardHeader from "./cardHeader";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { DetailList, DetailRow } from "./detailRow";
import useCfgBasicData from "next-common/context/centrifuge/basicData";
import { bnToLocaleString } from "next-common/utils/bn";
import Tooltip from "next-common/components/tooltip";
import LoadableContent from "next-common/components/common/loadableContent";

export default function TokenHoldersCard() {
  const [{ data = {}, loading: isLoading }] = useCfgBasicData();
  const { holders = {} } = data;
  const { all = 0, whales = 0, dolphins = 0 } = holders;

  return (
    <SecondaryCard>
      <div className="flex flex-col gap-[16px]">
        <CardHeader
          title={
            <div className="flex gap-[4px] items-center">
              <span>Total Token Holders</span>
              <Tooltip
                content={
                  <div className="flex flex-col">
                    <span>{"🐋 Whales: >= 1M CFG"}</span>
                    <span>{"🐬 Dolphins: 100K - 1M CFG"}</span>
                  </div>
                }
              />
            </div>
          }
          value={
            <LoadableContent isLoading={isLoading}>
              {bnToLocaleString(all)}
            </LoadableContent>
          }
        />
        <DetailList>
          <DetailRow
            title="Whales"
            value={
              <LoadableContent isLoading={isLoading}>
                {bnToLocaleString(whales)}
              </LoadableContent>
            }
          />
          <DetailRow
            title="Dolphins"
            value={
              <LoadableContent isLoading={isLoading}>
                {bnToLocaleString(dolphins)}
              </LoadableContent>
            }
          />
        </DetailList>
      </div>
    </SecondaryCard>
  );
}
