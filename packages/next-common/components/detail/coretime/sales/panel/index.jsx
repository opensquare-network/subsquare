import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import Divider from "next-common/components/styled/layout/divider";
import CoretimeSaleSummary from "next-common/components/coretime/salePanel/summary";
import useCoretimeSale from "next-common/context/coretime/sale/provider";

// TODO: CoretimeDetailSaleSummary
// TODO: import active panel
function HistoricalPanel() {
  const coretimeSale = useCoretimeSale();

  return (
    <NeutralPanel className="p-6 text-textPrimary">
      <h3 className="text16Bold">Coretime Sale #{coretimeSale.id}</h3>
      <Divider className="my-4" />
      <CoretimeSaleSummary />
      <Divider className="my-4" />
    </NeutralPanel>
  );
}

export default function CoretimeDetailSalePanel() {
  return (
    <div>
      <TitleContainer className="mb-4">Active Sale</TitleContainer>
      <HistoricalPanel />
    </div>
  );
}
