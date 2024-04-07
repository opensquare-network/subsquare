import FellowshipSalaryActiveCycle from "../cycles/current";
import FellowshipSalaryClaimants from "./list";

export default function FellowshipSalaryClaimantsContainer() {
  return (
    <div className="space-y-6">
      <FellowshipSalaryActiveCycle />
      <FellowshipSalaryClaimants />
    </div>
  );
}
