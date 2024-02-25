import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { usePageProps } from "next-common/context/page";
import FellowshipSalaryCycles from "next-common/components/fellowship/salary/cycles/list";

export default function FellowshipHistoryCyclesSection() {
  const { historyCycles } = usePageProps();

  return (
    <>
      <TitleContainer>
        <span>History Cycles</span>
      </TitleContainer>

      <div className="space-y-4 mt-4">
        <FellowshipSalaryCycles historyCycles={historyCycles} />
      </div>
    </>
  );
}
