import { useSelector } from "react-redux";
import { useNavCollapsed } from "next-common/context/nav";
import SummaryLayout from "next-common/components/summary/layout/layout";
import { cn } from "next-common/utils";
import SalaryStatsIndexItem from "next-common/components/fellowship/salary/cycles/summary/indexItem";
import SalaryStatsBudgetItem from "next-common/components/fellowship/salary/cycles/summary/budgetItem";
import SalaryStatsPotItem from "next-common/components/fellowship/salary/cycles/summary/potItem";
import SalaryStatsTotalPeriodItem from "next-common/components/fellowship/salary/cycles/summary/totalPeriodItem";
import SalaryStatsRegistrationItem from "next-common/components/fellowship/salary/cycles/summary/registrationItem";
import SalaryStatsUnregisteredItem from "next-common/components/fellowship/salary/cycles/summary/unregisteredItem";
import SalaryStatsTimeRemainItem from "next-common/components/fellowship/salary/cycles/summary/timeRemainItem";
import {
  DesktopPlaceHolderItem,
  MobilePlaceHolderItem,
} from "next-common/components/overview/fellowship/salary/stats";
import { ambassadorSalaryStatusSelector } from "next-common/store/reducers/ambassador/salary";
import { useAmbassadorSalaryCycleData } from "next-common/hooks/ambassador/salary/useAmbassadorSalaryCycleData";

export default function AmbassadorSalaryStats() {
  const [navCollapsed] = useNavCollapsed();
  const stats = useSelector(ambassadorSalaryStatusSelector);
  const cycleData = useAmbassadorSalaryCycleData(stats?.cycleIndex);
  const {
    cycleIndex,
    budget,
    totalRegistrations,
    totalUnregisteredPaid,
    cycleStart,
  } = stats || {};

  let pot = budget - totalUnregisteredPaid - totalRegistrations || null;
  pot = pot < 0 ? 0 : pot;

  return (
    <>
      <SummaryLayout
        className={cn(navCollapsed ? "max-sm:hidden" : "max-md:hidden")}
      >
        <SalaryStatsIndexItem index={cycleIndex} />
        <SalaryStatsBudgetItem budget={budget} />
        <SalaryStatsPotItem pot={pot} />
        <SalaryStatsTotalPeriodItem cycleStart={cycleStart} />
        <DesktopPlaceHolderItem />
        <SalaryStatsRegistrationItem cycleData={cycleData} />
        <SalaryStatsUnregisteredItem cycleData={cycleData} />
        <SalaryStatsTimeRemainItem />
      </SummaryLayout>
      <SummaryLayout className={cn(navCollapsed ? "sm:hidden" : "md:hidden")}>
        <SalaryStatsIndexItem index={cycleIndex} />
        <MobilePlaceHolderItem />
        <SalaryStatsBudgetItem budget={budget} />
        <SalaryStatsPotItem pot={pot} />
        <SalaryStatsRegistrationItem cycleData={cycleData} />
        <SalaryStatsUnregisteredItem cycleData={cycleData} />
        <SalaryStatsTotalPeriodItem cycleStart={cycleStart} />
        <SalaryStatsTimeRemainItem />
      </SummaryLayout>
    </>
  );
}
