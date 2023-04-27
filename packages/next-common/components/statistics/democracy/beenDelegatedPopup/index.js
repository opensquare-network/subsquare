import React, { useEffect, useState } from "react";
import Popup from "next-common/components/popup/wrapper/Popup";
import DelegationSummary from "./delegationSummary";
import nextApi from "next-common/services/nextApi";
import DelegationTabList from "./delegationTabList";

export default function BeenDelegatedListPopup({
  delegatee,
  delegatorsCount,
  delegatedCapital,
  delegatedVotes,
  setShow,
}) {
  const [beenDelegatedList, setBeenDelegatedList] = useState([]);
  useEffect(() => {
    nextApi.fetch(`statistics/democracy/delegatee/${delegatee}/delegators`).then(({ result }) => {
      setBeenDelegatedList(result);
    });
  }, [delegatee]);

  return (
    <Popup wide title="Been Delegated" onClose={() => setShow(false)}>
      <DelegationSummary
        delegatee={delegatee}
        delegatorsCount={delegatorsCount}
        delegatedCapital={delegatedCapital}
        delegatedVotes={delegatedVotes}
      />
      <DelegationTabList beenDelegatedList={beenDelegatedList} />
    </Popup>
  );
}
