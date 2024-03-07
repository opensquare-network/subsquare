import { usePageProps } from "next-common/context/page";
import { fellowshipSalaryCycleRegisteredPaymentsApi } from "next-common/services/url";
import { useFellowshipSalaryCycleRankColumn } from "./columns/rank";
import { useFellowshipSalaryCycleMemberColumn } from "./columns/member";
import { useFellowshipSalaryCycleSalaryColumn } from "./columns/salary";
import { useFellowshipSalaryCyclePaidColumn } from "./columns/paid";
import { useFellowshipSalaryCycleBeneficiaryColumn } from "./columns/beneficiary";
import { useFellowshipSalaryCycleTimeAgeColumn } from "./columns/timeAge";

export function useFellowshipSalaryCyclePaymentsTabItem() {
  const { registeredPayments, unRegisteredPayments, id } = usePageProps();

  const activeCount =
    registeredPayments?.total + unRegisteredPayments?.total || 0;

  const rankColumn = useFellowshipSalaryCycleRankColumn();

  const memberColumn = useFellowshipSalaryCycleMemberColumn();
  memberColumn.name = "Account";
  memberColumn.width = 212;

  const beneficiaryColumn = useFellowshipSalaryCycleBeneficiaryColumn();

  const timeAgeColumn = useFellowshipSalaryCycleTimeAgeColumn();

  const salaryColumn = useFellowshipSalaryCycleSalaryColumn();
  salaryColumn.name = "Yearly Salary";
  salaryColumn.className = "text-right";

  const paidColumn = useFellowshipSalaryCyclePaidColumn();

  return {
    name: "Payments",
    activeCount,
    noDataText: "No payments",
    columns: [
      rankColumn,
      memberColumn,
      beneficiaryColumn,
      timeAgeColumn,
      salaryColumn,
      paidColumn,
    ],
    api: {
      path: fellowshipSalaryCycleRegisteredPaymentsApi(id),
      initData: registeredPayments,
    },
  };
}
