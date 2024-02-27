import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import FellowshipSalaryStats from "next-common/components/overview/fellowship/salary/stats";

export default function FellowshipSalaryActiveCycle() {
  return (
    <>
      <TitleContainer className="mb-4">Current Cycle</TitleContainer>
      <FellowshipSalaryStats />
    </>
  );
}
