import DelegationList from "next-common/components/profile/delegation/common/delegationList";
import {
  useColumnsDef,
  Title,
} from "next-common/components/profile/delegation/delegatedVotes/democracyDelegation";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import DemocracyRemoveDelegation from "next-common/components/summary/democracySummaryDelegation/removeDelegation";

export default function MyDemocracyDelegation({
  delegating,
  isLoading,
  refresh,
}) {
  const sharedColumnsDef = useColumnsDef();
  const columnsDef = [
    ...sharedColumnsDef,
    [
      {
        name: "",
        style: {
          textAlign: "right",
          width: 80,
          minWidth: 80,
        },
      },
      () => <DemocracyRemoveDelegation key="action" refresh={refresh} />,
    ],
  ];

  return (
    <>
      <Title />
      <SecondaryCard>
        <DelegationList
          isLoading={isLoading}
          delegations={delegating && [delegating]}
          columnsDef={columnsDef}
        />
      </SecondaryCard>
    </>
  );
}
