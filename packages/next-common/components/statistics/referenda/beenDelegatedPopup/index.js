import React from "react";
import Popup from "next-common/components/popup/wrapper/Popup";
import DelegationSummary from "./delegationSummary";
import DelegationTabList from "./delegationTabList";

export default function BeenDelegatedListPopup({
  delegatee,
  delegatorsCount,
  delegatedCapital,
  delegatedVotes,
  tracksCount,
  setShow,
}) {
  return (
    <Popup
      title="Been Delegated"
      className="!w-[720px] max-h-screen overflow-y-scroll scrollbar-pretty max-sm:w-full"
      onClose={() => setShow(false)}
    >
      <DelegationSummary
        delegatee={delegatee}
        delegatorsCount={delegatorsCount}
        delegatedCapital={delegatedCapital}
        delegatedVotes={delegatedVotes}
        tracksCount={tracksCount}
      />
      <DelegationTabList delegatee={delegatee} />
    </Popup>
  );
}
