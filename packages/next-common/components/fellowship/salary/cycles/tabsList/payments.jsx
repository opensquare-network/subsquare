import { usePageProps } from "next-common/context/page";
import {
  fellowshipSalaryCycleRegisteredPaymentsApi,
  fellowshipSalaryCycleUnregisteredPaymentsApi,
} from "next-common/services/url";
import { useFellowshipSalaryCycleRankColumn } from "./columns/rank";
import { useFellowshipSalaryCycleAccountColumn } from "./columns/account";
import { useFellowshipSalaryCycleYearlySalaryColumn } from "./columns/yearlySalary";
import { useFellowshipSalaryCyclePaidColumn } from "./columns/paid";
import { useFellowshipSalaryCycleBeneficiaryColumn } from "./columns/beneficiary";
import { useFellowshipSalaryCycleTimeAgeColumn } from "./columns/timeAge";
import { useState } from "react";
import { FellowshipSalaryCycleDetailListTemplateTable } from "./template";
import CheckableTag from "next-common/components/tags/checkable";
import { defaultPageSize } from "next-common/utils/constants";

export function useFellowshipSalaryCyclePaymentsTabItem() {
  const { registeredPayments, unRegisteredPayments, id } = usePageProps();

  const activeCount =
    registeredPayments?.total + unRegisteredPayments?.total || 0;

  const rankColumn = useFellowshipSalaryCycleRankColumn();

  const accountColumn = useFellowshipSalaryCycleAccountColumn();
  accountColumn.width = 212;

  const beneficiaryColumn = useFellowshipSalaryCycleBeneficiaryColumn();

  const timeAgeColumn = useFellowshipSalaryCycleTimeAgeColumn();

  const yearlySalaryColumn = useFellowshipSalaryCycleYearlySalaryColumn();
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
          path: fellowshipSalaryCycleRegisteredPaymentsApi(id),
          initData: registeredPayments,
          params: {
            pageSize: defaultPageSize,
          },
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
          path: fellowshipSalaryCycleUnregisteredPaymentsApi(id),
          initData: unRegisteredPayments,
          params: {
            pageSize: defaultPageSize,
          },
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
              onClick={() => {
                setSubTabActiveValue(subTab.value);
              }}
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
