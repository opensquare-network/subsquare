import { NeutralPanel } from "../../styled/containers/neutralPanel";
import Divider from "../../styled/layout/divider";
import CoretimeSalePanelChartPeriodProgress from "./chart/periodProgress";
import CoretimeSaleSummary from "./summary";
import useCoretimeSale from "next-common/context/coretime/sale/provider";

export default function CoretimeSalePanel() {
  const coretimeSale = useCoretimeSale();

  return (
    <NeutralPanel className="p-6 text-textPrimary">
      <h3 className="text16Bold">Coretime Sale #{coretimeSale.id}</h3>
      <Divider className="my-4" />
      <CoretimeSaleSummary data={coretimeSale} />

      <hr className="border-dashed border-neutral300 my-4" />

      <div>
        <div className="h-48 bg-neutral200">
          <div className="flex justify-center items-center h-full">chart</div>
        </div>

        <CoretimeSalePanelChartPeriodProgress className="mt-2" />
      </div>
    </NeutralPanel>
  );
}
