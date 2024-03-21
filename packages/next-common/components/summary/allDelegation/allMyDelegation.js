import HStack from "next-common/components/styled/hStack";
import ListSVG from "next-common/assets/imgs/icons/list.svg";
import Tooltip from "next-common/components/tooltip";
import { useState } from "react";
import AllMyDelegationPopup from "next-common/components/summary/democracyAllMyDelegationPopup";
import { ListButton } from "./styled";
import AllMyDelegationInfo from "./allMyDelegationInfo";

export default function AllMyDelegation({ delegations }) {
  const [showAllMyDelegationPopup, setShowAllMyDelegationPopup] =
    useState(false);

  return (
    <>
      <HStack space={8}>
        <AllMyDelegationInfo delegations={delegations} />

        <Tooltip content="My delegation detail">
          <div>
            <ListButton onClick={() => setShowAllMyDelegationPopup(true)}>
              <ListSVG />
            </ListButton>
          </div>
        </Tooltip>
      </HStack>

      {showAllMyDelegationPopup && (
        <AllMyDelegationPopup setShow={setShowAllMyDelegationPopup} />
      )}
    </>
  );
}
