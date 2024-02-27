import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import FellowshipSalaryStats from "next-common/components/overview/fellowship/salary/stats";

export default function FellowshipSalaryOverview() {
  return (
    <>
      <TitleContainer className="mb-4">Fellowship Salary Cycle</TitleContainer>
      <FellowshipSalaryStats />
    </>
  );
}
