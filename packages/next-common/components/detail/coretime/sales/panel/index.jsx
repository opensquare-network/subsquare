import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import Divider from "next-common/components/styled/layout/divider";
import CoretimeHistoricalSaleSummary from "./summary";
import useCoretimeSale from "next-common/context/coretime/sale/provider";
import { ClosedTag } from "next-common/components/tags/state/styled";
import CoretimeSaleSummary from "next-common/components/coretime/salePanel/summary";
import CoretimeSalePanelChart from "next-common/components/coretime/salePanel/chart";
import { CHAIN } from "next-common/utils/constants";
import { isKusamaChain } from "next-common/utils/chain";

const isKusama = isKusamaChain(CHAIN);

export default function CoretimeDetailSalePanel() {
  const coretimeSale = useCoretimeSale();
  const { isFinal, id } = coretimeSale || {};

  const showChart = isKusama ? coretimeSale.id >= 4 : true;

  return (
    <div>
      <NeutralPanel className="p-6 text-textPrimary">
        <div className="flex justify-between gap-x-4">
          <h3 className="text16Bold">Coretime Sale #{id}</h3>
          {isFinal && <ClosedTag>End</ClosedTag>}
        </div>

        <Divider className="my-4" />

        {isFinal ? <CoretimeHistoricalSaleSummary /> : <CoretimeSaleSummary />}

        {showChart && (
          <>
            <hr className="border-dashed border-neutral300 my-4" />
            <CoretimeSalePanelChart />
          </>
        )}
      </NeutralPanel>
    </div>
  );
}
