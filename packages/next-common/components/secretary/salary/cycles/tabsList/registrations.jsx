import { usePageProps } from "next-common/context/page";
import { secretarySalaryCycleRegistrationsApi } from "next-common/services/url";
import { useFellowshipSalaryCycleRankColumn } from "next-common/components/fellowship/salary/cycles/tabsList/columns/rank";
import { useFellowshipSalaryCycleAccountColumn } from "next-common/components/fellowship/salary/cycles/tabsList/columns/account";
import { useFellowshipSalaryCycleYearlySalaryColumn } from "next-common/components/fellowship/salary/cycles/tabsList/columns/yearlySalary";
import {
  useFellowshipSalaryCyclePaymentColumn,
  useFellowshipSalaryCyclePaymentMobileColumns,
} from "next-common/components/fellowship/salary/cycles/tabsList/columns/payment";
import { defaultPageSize } from "next-common/utils/constants";

export function useSecretarySalaryCycleRegistrationsTabItem() {
  const { registrations, id } = usePageProps();

  const rankColumn = useFellowshipSalaryCycleRankColumn();
  const accountColumn = useFellowshipSalaryCycleAccountColumn();
  const yearlySalaryColumn = useFellowshipSalaryCycleYearlySalaryColumn();
  const paymentColumn = useFellowshipSalaryCyclePaymentColumn();
  const paymentMobileColumns = useFellowshipSalaryCyclePaymentMobileColumns();

  return {
    name: "Registrations",
    activeCount: registrations?.total ?? 0,
    noDataText: "No registrations",
    columns: [
      rankColumn,
      accountColumn,
      yearlySalaryColumn,
      paymentColumn,
      ...paymentMobileColumns,
    ],
    api: {
      path: secretarySalaryCycleRegistrationsApi(id),
      initData: registrations,
      params: {
        pageSize: defaultPageSize,
      },
    },
  };
}
