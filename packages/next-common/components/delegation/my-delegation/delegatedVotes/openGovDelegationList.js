import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { useSelector } from "react-redux";
import { myReferendaDelegationsSelector } from "next-common/store/reducers/myOnChainData/referenda/myReferendaDelegations";
import {
  getColumns,
  Title,
  List,
} from "next-common/components/profile/delegation/delegatedVotes/openGovDelegationList";
import RemoveDelegation from "next-common/components/summary/democracyAllMyDelegationPopup/remove";

export default function OpenGovDelegationList() {
  const delegations = useSelector(myReferendaDelegationsSelector);
  const columnsDef = [
    ...getColumns(),
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
        <List delegations={delegations} columnsDef={columnsDef} />
      </SecondaryCard>
    </>
  );
}
