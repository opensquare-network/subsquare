import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { useSelector } from "react-redux";
import { myReferendaDelegationsSelector } from "next-common/store/reducers/myOnChainData/referenda/myReferendaDelegations";
import {
  useColumnsDef,
  Title,
} from "next-common/components/profile/delegation/delegatedVotes/openGovDelegationList";
import DelegationList from "next-common/components/profile/delegation/common/delegationList";
import RemoveDelegation from "next-common/components/summary/democracyAllMyDelegationPopup/remove";

export default function OpenGovDelegationList() {
  const delegations = useSelector(myReferendaDelegationsSelector);
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
      (item) => <RemoveDelegation key="action" trackId={item.trackId} />,
    ],
  ];

  return (
    <>
      <Title delegations={delegations} />
      <SecondaryCard>
        <DelegationList
          isLoading={!delegations}
          delegations={delegations}
          columnsDef={columnsDef}
        />
      </SecondaryCard>
    </>
  );
}
