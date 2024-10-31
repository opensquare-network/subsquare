import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import Divider from "next-common/components/styled/layout/divider";
import CoretimeDetailSaleSummary from "./summary";
import useCoretimeSale from "next-common/context/coretime/sale/provider";

// TODO: import active panel
function HistoricalPanel() {
  const coretimeSale = useCoretimeSale();

  return (
    <NeutralPanel className="p-6 text-textPrimary">
      <h3 className="text16Bold">Coretime Sale #{coretimeSale.id}</h3>
      {/* TODO: End pin*/}
      <span>End</span>
      <Divider className="my-4" />
      <CoretimeDetailSaleSummary />
      <Divider className="my-4" />
    </NeutralPanel>
  );
}

// TODO: active -> historical sale
export default function CoretimeDetailSalePanel() {
  return (
    <div>
      <HistoricalPanel />
    </div>
  );
}
