import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { usePageProps } from "next-common/context/page";
import FellowshipSalaryCycles from "next-common/components/fellowship/salary/cycles/list";
import { useCollectivesContext } from "next-common/context/collectives/collectives";

export default function FellowshipHistoryCyclesSection() {
  const { section } = useCollectivesContext();
  const { historyCycles } = usePageProps();

  return (
    <>
      <TitleContainer className="my-4">History</TitleContainer>

      <div className="space-y-4 mt-4">
        <FellowshipSalaryCycles
          historyCycles={historyCycles}
          resolveActionColLink={(data) =>
            `/${section}/salary/cycles/${data.index}`
          }
        />
      </div>
    </>
  );
}
