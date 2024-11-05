import { NeutralPanel } from "../../styled/containers/neutralPanel";
import Divider from "../../styled/layout/divider";
import CoretimeSalePanelChart from "./chart";
import CoretimeSaleSummary from "./summary";
import useCoretimeSale from "next-common/context/coretime/sale/provider";

export default function CoretimeSalePanel() {
  const coretimeSale = useCoretimeSale();

  return (
    <NeutralPanel className="p-6 text-textPrimary">
      <h3 className="text16Bold">Coretime Sale #{coretimeSale.id}</h3>
      <Divider className="my-4" />
      <CoretimeSaleSummary />

      <hr className="border-dashed border-neutral300 mt-4" />

      <CoretimeSalePanelChart className="mt-2" />
    </NeutralPanel>
  );
}
