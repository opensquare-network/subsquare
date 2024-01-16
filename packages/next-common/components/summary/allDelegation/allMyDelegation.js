import HStack from "next-common/components/styled/hStack";
import GreyInfoPanel from "next-common/components/summary/styled/greyInfoPanel";
import ListSVG from "next-common/assets/imgs/icons/list.svg";
import Tooltip from "next-common/components/tooltip";
import { useState } from "react";
import AllMyDelegationPopup from "next-common/components/summary/democracyAllMyDelegationPopup";
import { Count, ListButton } from "./styled";

export default function AllMyDelegation({ delegations }) {
  const [showAllMyDelegationPopup, setShowAllMyDelegationPopup] =
    useState(false);

  return (
    <>
      <HStack space={8}>
        <GreyInfoPanel>
          My delegation <Count>{delegations.length}</Count>
        </GreyInfoPanel>

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
