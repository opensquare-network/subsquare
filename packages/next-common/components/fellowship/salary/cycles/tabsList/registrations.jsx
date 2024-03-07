import { usePageProps } from "next-common/context/page";
import { fellowshipSalaryCycleRegistrationsApi } from "next-common/services/url";
import { useFellowshipSalaryCycleRankColumn } from "./columns/rank";
import { useFellowshipSalaryCycleMemberColumn } from "./columns/member";
import { useFellowshipSalaryCycleYearlySalaryColumn } from "./columns/yearlySalary";
import { useFellowshipSalaryCyclePaymentColumn } from "./columns/payment";

export function useFellowshipSalaryCycleRegistrationsTabItem() {
  const { registrations } = usePageProps();
  const { id } = usePageProps();

  const rankColumn = useFellowshipSalaryCycleRankColumn();
  const memberColumn = useFellowshipSalaryCycleMemberColumn();
  const yearlySalaryColumn = useFellowshipSalaryCycleYearlySalaryColumn();
  const paymentColumn = useFellowshipSalaryCyclePaymentColumn();

  return {
    name: "Registrations",
    activeCount: registrations?.total ?? 0,
    noDataText: "No registrations",
    columns: [rankColumn, memberColumn, yearlySalaryColumn, paymentColumn],
    api: {
      path: fellowshipSalaryCycleRegistrationsApi(id),
      initData: registrations,
    },
  };
}
