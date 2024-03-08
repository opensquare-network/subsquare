import { usePageProps } from "next-common/context/page";
import { fellowshipSalaryCycleRegistrationsApi } from "next-common/services/url";
import { useFellowshipSalaryCycleRankColumn } from "./columns/rank";
import { useFellowshipSalaryCycleAccountColumn } from "./columns/account";
import { useFellowshipSalaryCycleYearlySalaryColumn } from "./columns/yearlySalary";
import {
  useFellowshipSalaryCyclePaymentColumn,
  useFellowshipSalaryCyclePaymentMobileColumns,
} from "./columns/payment";

export function useFellowshipSalaryCycleRegistrationsTabItem() {
  const { registrations } = usePageProps();
  const { id } = usePageProps();

  registrations.items[0] = {
    index: 1,
    who: "16a357f5Sxab3V2ne4emGQvqJaCLeYpTMx3TCjnQhmJQ71DX",
    beneficiary: "16a357f5Sxab3V2ne4emGQvqJaCLeYpTMx3TCjnQhmJQ71DX",
    isRegistered: true,
    salary: "20000000000",
    amount: "20000000000",
    isPaid: true,
    indexer: {
      blockHeight: 3201749,
      blockHash:
        "0xc0a6678059fa86a0ef264d2aacc137c9100149ecfc17d585b7444baf61b2d3a5",
      blockTime: 1708084632000,
      eventIndex: 2,
      extrinsicIndex: 2,
    },
    paidIndexer: {
      blockHeight: 3201749,
      blockHash:
        "0xc0a6678059fa86a0ef264d2aacc137c9100149ecfc17d585b7444baf61b2d3a5",
      blockTime: 1708084632000,
      eventIndex: 2,
      extrinsicIndex: 2,
    },
    memberInfo: { salary: 20000000000, isActive: true, rank: 2 },
  };

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
    },
  };
}
