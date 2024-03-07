import { usePageProps } from "next-common/context/page";
import { fellowshipSalaryCycleRegisteredPaymentsApi } from "next-common/services/url";
import { useFellowshipSalaryCycleRankColumn } from "./columns/rank";
import { useFellowshipSalaryCycleMemberColumn } from "./columns/member";
import { useFellowshipSalaryCycleYearlySalaryColumn } from "./columns/yearlySalary";
import { useFellowshipSalaryCyclePaidColumn } from "./columns/paid";
import { useFellowshipSalaryCycleBeneficiaryColumn } from "./columns/beneficiary";
import { useFellowshipSalaryCycleTimeAgeColumn } from "./columns/timeAge";

export function useFellowshipSalaryCyclePaymentsTabItem() {
  const { registeredPayments, unRegisteredPayments, id } = usePageProps();

  registeredPayments.items = [
    {
      memberInfo: { rank: 2 },
      time: 1689796218805,
    },
    {
      memberInfo: { rank: 3 },
      time: 1689796218805,
    },
  ];

  const activeCount =
    registeredPayments?.total + unRegisteredPayments?.total || 0;

  const rankColumn = useFellowshipSalaryCycleRankColumn();
  const memberColumn = useFellowshipSalaryCycleMemberColumn();
  memberColumn.width = 212;
  const beneficiaryColumn = useFellowshipSalaryCycleBeneficiaryColumn();
  const timeAgeColumn = useFellowshipSalaryCycleTimeAgeColumn();
  const yearlySalaryColumn = useFellowshipSalaryCycleYearlySalaryColumn();
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
      yearlySalaryColumn,
      paidColumn,
    ],
    api: {
      path: fellowshipSalaryCycleRegisteredPaymentsApi(id),
      initData: registeredPayments,
    },
  };
}
