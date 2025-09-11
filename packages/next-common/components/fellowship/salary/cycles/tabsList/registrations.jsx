import { usePageProps } from "next-common/context/page";
import { fellowshipSalaryCycleRegistrationsApi } from "next-common/services/url";
import { useFellowshipSalaryCycleRankColumn } from "./columns/rank";
import { useFellowshipSalaryCycleAccountColumn } from "./columns/account";
import { useFellowshipSalaryCycleYearlySalaryColumn } from "./columns/yearlySalary";
import {
  useFellowshipSalaryCyclePaymentColumn,
  useFellowshipSalaryCyclePaymentMobileColumns,
} from "./columns/payment";
import { defaultPageSize } from "next-common/utils/constants";

export function useFellowshipSalaryCycleRegistrationsTabItem() {
  const { registrations } = usePageProps();
  const { id } = usePageProps();

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
      path: fellowshipSalaryCycleRegistrationsApi(id),
      initData: registrations,
      params: {
        pageSize: defaultPageSize,
      },
    },
  };
}
