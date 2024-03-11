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
    label: "Registered",
    count: registeredPayments?.total,
    content: (
      <FellowshipSalaryCycleDetailListTemplateTable
        columns={columns}
        noDataText={noDataText}
        api={{
          path: fellowshipSalaryCycleRegisteredPaymentsApi(id),
          initData: registeredPayments,
        }}
      />
    ),
  };
  const unRegisteredTab = {
    label: "Unregistered",
    count: unRegisteredPayments?.total,
    content: (
      <FellowshipSalaryCycleDetailListTemplateTable
        columns={columns}
        noDataText={noDataText}
        api={{
          path: fellowshipSalaryCycleUnregisteredPaymentsApi(id),
          initData: unRegisteredPayments,
        }}
      />
    ),
  };

  const subTabs = [registeredTab, unRegisteredTab];
  const subTabLabels = subTabs.map((subTab) => subTab.label);
  const [subTabActiveLabel, setSubTabActiveLabel] = useState(subTabLabels[0]);

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
              checked={subTabActiveLabel === subTab.label}
              key={subTab.label}
              count={subTab.count}
              onClick={() => {
                setSubTabActiveLabel(subTab.label);
              }}
            >
              {subTab.label}
            </CheckableTag>
          ))}
        </div>

        {subTabActiveLabel === registeredTab.label && registeredTab.content}

        {subTabActiveLabel === unRegisteredTab.label && unRegisteredTab.content}
      </>
    ),
  };
}
