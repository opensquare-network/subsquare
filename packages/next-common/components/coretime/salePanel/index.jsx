import { usePageProps } from "next-common/context/page";
import { useCoretimeQuery } from "next-common/hooks/apollo";
import { GET_CORETIME_SALE } from "next-common/services/gql/coretime";
import { NeutralPanel } from "../../styled/containers/neutralPanel";
import Divider from "../../styled/layout/divider";
import CoretimeSaleSummary from "./summary";

export default function CoretimeSalePanel() {
  const { id } = usePageProps();
  const { data } = useCoretimeQuery(GET_CORETIME_SALE, {
    variables: {
      id,
    },
  });

  return (
    <NeutralPanel className="p-6 text-textPrimary">
      <h3 className="text16Bold">Coretime Sale #{id}</h3>
      <Divider className="my-4" />
      <CoretimeSaleSummary data={data?.coretimeSale} />

      <hr className="border-dashed border-neutral300 my-4" />

      <div className="h-48 bg-neutral200">
        <div className="flex justify-center items-center h-full">chart</div>
      </div>
    </NeutralPanel>
  );
}
