import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { useState } from "react";
import { FellowshipSalaryPayments } from "next-common/components/profile/fellowship/salary/payments";
import { useProfileFellowshipSalaryPaymentCycleColumn } from "next-common/components/profile/fellowship/salary/payments/columns/cycle";
import { useProfileFellowshipSalaryPaymentRankColumn } from "next-common/components/profile/fellowship/salary/payments/columns/rank";
import { useProfileFellowshipSalaryPaymentBeneficiaryColumn } from "next-common/components/profile/fellowship/salary/payments/columns/beneficiary";
import { useProfileFellowshipSalaryPaymentTimeAgeColumn } from "next-common/components/profile/fellowship/salary/payments/columns/timeAge";
import { useProfileFellowshipSalaryPaymentRegistrationColumn } from "next-common/components/profile/fellowship/salary/payments/columns/Registration";
import { useProfileFellowshipSalaryPaymentPaidColumn } from "next-common/components/profile/fellowship/salary/payments/columns/paid";
import ProfileFellowshipSalaryFeeds from "next-common/components/profile/fellowship/salary/feeds";
import Tabs from "next-common/components/tabs";

function MemberFellowshipSalaryPayments({ setPaymentsCount }) {
  const cycleColumn = useProfileFellowshipSalaryPaymentCycleColumn({
    width: 80,
  });
  const rankColumn = useProfileFellowshipSalaryPaymentRankColumn({ width: 80 });
  const beneficiaryColumn = useProfileFellowshipSalaryPaymentBeneficiaryColumn({
    width: 180,
  });
  const timeAgeColumn = useProfileFellowshipSalaryPaymentTimeAgeColumn();
  const registrationColumn =
    useProfileFellowshipSalaryPaymentRegistrationColumn({
      width: 80,
    });
  const paidColumn = useProfileFellowshipSalaryPaymentPaidColumn({
    width: 140,
  });

  const columns = [
    cycleColumn,
    rankColumn,
    beneficiaryColumn,
    timeAgeColumn,
    registrationColumn,
    paidColumn,
  ];

  return (
    <FellowshipSalaryPayments
      setPaymentsCount={setPaymentsCount}
      columns={columns}
    />
  );
}

function MemberFellowshipSalaryFeeds() {
  return <ProfileFellowshipSalaryFeeds />;
}

function FellowshipSalaryCard() {
  const [paymentsCount, setPaymentsCount] = useState();

  const tabs = [
    {
      label: "Payments",
      value: "payments",
      activeCount: paymentsCount,
      content: (
        <MemberFellowshipSalaryPayments setPaymentsCount={setPaymentsCount} />
      ),
    },
    {
      label: "Timeline",
      value: "timeline",
      content: <MemberFellowshipSalaryFeeds />,
    },
  ];

  const [activeTabValue, setActiveTabValue] = useState(tabs[0].value);

  return (
    <Tabs
      tabs={tabs}
      activeTabValue={activeTabValue}
      onTabClick={(tab) => {
        setActiveTabValue(tab.value);
      }}
    />
  );
}

export default function SalaryActivities() {
  return (
    <SecondaryCard>
      <FellowshipSalaryCard />
    </SecondaryCard>
  );
}
