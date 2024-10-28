import { NeutralPanel } from "../../styled/containers/neutralPanel";
import Divider from "../../styled/layout/divider";
import CoretimeSaleSummary from "./summary";
import useCoretimeSale from "next-common/context/coretime/sale/provider";
import useSaleEnd from "next-common/context/coretime/hooks/useSaleEnd";

export default function CoretimeSalePanel() {
  const coretimeSale = useCoretimeSale();
  const saleEnd = useSaleEnd();
  console.log("sale end", saleEnd);

  return (
    <NeutralPanel className="p-6 text-textPrimary">
      <h3 className="text16Bold">Coretime Sale #{coretimeSale.id}</h3>
      <Divider className="my-4" />
      <CoretimeSaleSummary data={coretimeSale} />

      <hr className="border-dashed border-neutral300 my-4" />

      <div className="h-48 bg-neutral200">
        <div className="flex justify-center items-center h-full">chart</div>
      </div>
    </NeutralPanel>
  );
}
