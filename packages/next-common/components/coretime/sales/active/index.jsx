import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import Divider from "next-common/components/styled/layout/divider";
import CoretimeSaleSummary from "next-common/components/coretime/salePanel/summary";
import useCoretimeSale from "next-common/context/coretime/sale/provider";
import Link from "next/link";

function ViewDetail({ id }) {
  const href = `/coretime/sales/${id}`;

  return (
    <div className="flex justify-end">
      <Link href={href} className="text-theme500 text14Medium">
        View Detail
      </Link>
    </div>
  );
}

function ActiveCoretimeSalePanel() {
  const { id } = useCoretimeSale();

  return (
    <NeutralPanel className="p-6 text-textPrimary">
      <h3 className="text16Bold">Coretime Sale #{id}</h3>
      <Divider className="my-4" />
      <CoretimeSaleSummary />
      <Divider className="my-4" />
      <ViewDetail id={id} />
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
