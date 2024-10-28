import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import Divider from "next-common/components/styled/layout/divider";
import CoretimeSaleSummary from "next-common/components/coretime/salePanel/summary";
import useCoretimeSale from "next-common/context/coretime/sale/provider";
import Link from "next/link";

function ViewDetail() {
  const href = "/coretime";

  return (
    <div className="flex justify-end pt-[8px]">
      <Link href={href} className="text-theme500 text14Medium">
        View Detail
      </Link>
    </div>
  );
}

function ActiveCoretimeSalePanel() {
  const coretimeSale = useCoretimeSale();

  return (
    <NeutralPanel className="p-6 text-textPrimary">
      <h3 className="text16Bold">Coretime Sale #{coretimeSale.id}</h3>
      <Divider className="my-4" />
      <CoretimeSaleSummary data={coretimeSale} />
      <ViewDetail />
    </NeutralPanel>
  );
}

export default function ActiveCoretimeSale() {
  return (
    <div>
      <TitleContainer className="mb-4">Active Sale</TitleContainer>
      <ActiveCoretimeSalePanel />
    </div>
  );
}
