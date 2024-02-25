import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { usePageProps } from "next-common/context/page";

export default function FellowshipSalaryActiveCycle() {
  const { activeCycle } = usePageProps();
  console.log("activeCycle", activeCycle);

  return (
    <>
      <TitleContainer>
        <span>Current Cycle</span>
      </TitleContainer>
    </>
  );
}
