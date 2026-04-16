import { usePageProps } from "next-common/context/page";
import {
  secretarySalaryCycleRegisteredPaymentsApi,
  secretarySalaryCycleUnregisteredPaymentsApi,
} from "next-common/services/url";
import { useFellowshipSalaryCycleRankColumn } from "next-common/components/fellowship/salary/cycles/tabsList/columns/rank";
import { useFellowshipSalaryCycleAccountColumn } from "next-common/components/fellowship/salary/cycles/tabsList/columns/account";
import { useFellowshipSalaryCycleYearlySalaryColumn } from "next-common/components/fellowship/salary/cycles/tabsList/columns/yearlySalary";
import { useFellowshipSalaryCyclePaidColumn } from "next-common/components/fellowship/salary/cycles/tabsList/columns/paid";
import { useFellowshipSalaryCycleBeneficiaryColumn } from "next-common/components/fellowship/salary/cycles/tabsList/columns/beneficiary";
import { useFellowshipSalaryCycleTimeAgeColumn } from "next-common/components/fellowship/salary/cycles/tabsList/columns/timeAge";
import { useState } from "react";
import { FellowshipSalaryCycleDetailListTemplateTable } from "next-common/components/fellowship/salary/cycles/tabsList/template";
import CheckableTag from "next-common/components/tags/checkable";
import { defaultPageSize } from "next-common/utils/constants";

export function useSecretarySalaryCyclePaymentsTabItem() {
  const { registeredPayments, unRegisteredPayments, id } = usePageProps();

  const activeCount =
    registeredPayments?.total + unRegisteredPayments?.total || 0;

  const rankColumn = useFellowshipSalaryCycleRankColumn();

  const accountColumn = useFellowshipSalaryCycleAccountColumn();
  // eslint-disable-next-line react-hooks/immutability
  accountColumn.width = 212;

  const beneficiaryColumn = useFellowshipSalaryCycleBeneficiaryColumn();
  const timeAgeColumn = useFellowshipSalaryCycleTimeAgeColumn();

  const yearlySalaryColumn = useFellowshipSalaryCycleYearlySalaryColumn();
  // eslint-disable-next-line react-hooks/immutability
  yearlySalaryColumn.className = "text-right";

  const paidColumn = useFellowshipSalaryCyclePaidColumn();

  const columns = [
    rankColumn,
    accountColumn,
    beneficiaryColumn,
    timeAgeColumn,
    yearlySalaryColumn,
    paidColumn,
  ];

  const noDataText = "No payments";

  const registeredTab = {
    value: "registered",
    label: "Registered",
    count: registeredPayments?.total,
    content: (
      <FellowshipSalaryCycleDetailListTemplateTable
        columns={columns}
        noDataText={noDataText}
        api={{
          path: secretarySalaryCycleRegisteredPaymentsApi(id),
          initData: registeredPayments,
          params: { pageSize: defaultPageSize },
        }}
      />
    ),
  };
  const unRegisteredTab = {
    value: "unregistered",
    label: "Unregistered",
    count: unRegisteredPayments?.total,
    content: (
      <FellowshipSalaryCycleDetailListTemplateTable
        columns={columns}
        noDataText={noDataText}
        api={{
          path: secretarySalaryCycleUnregisteredPaymentsApi(id),
          initData: unRegisteredPayments,
          params: { pageSize: defaultPageSize },
        }}
      />
    ),
  };

  const subTabs = [registeredTab, unRegisteredTab];
  const subTabValues = subTabs.map((subTab) => subTab.value);
  const [subTabActiveValue, setSubTabActiveValue] = useState(subTabValues[0]);

  return {
    name: "Payments",
    activeCount,
    noDataText,
    columns,
    content: (
      <>
        <div className="flex items-center gap-x-2 mb-4">
          {subTabs.map((subTab) => (
            <CheckableTag
              checked={subTabActiveValue === subTab.value}
              key={subTab.value}
              count={subTab.count}
              onClick={() => setSubTabActiveValue(subTab.value)}
            >
              {subTab.label}
            </CheckableTag>
          ))}
        </div>

        {subTabActiveValue === registeredTab.value && registeredTab.content}
        {subTabActiveValue === unRegisteredTab.value && unRegisteredTab.content}
      </>
    ),
  };
}
