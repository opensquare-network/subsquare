import HStack from "next-common/components/styled/hStack";
import ListSVG from "next-common/assets/imgs/icons/list.svg";
import Tooltip from "next-common/components/tooltip";
import { useState } from "react";
import AllBeenDelegatedListPopup from "next-common/components/summary/democracyAllBeenDelegatedPopup";
import { ListButton } from "./styled";
import AllBeenDelegatedInfo from "./allBeenDelegatedInfo";

export default function AllBeenDelegated({ beenDelegatedList }) {
  const [showAllBeenDelegatedPopup, setShowAllBeenDelegatedPopup] =
    useState(false);

  return (
    <>
      <HStack space={8}>
        <AllBeenDelegatedInfo beenDelegatedList={beenDelegatedList} />

        <Tooltip content="Delegated detail">
          <div>
            <ListButton onClick={() => setShowAllBeenDelegatedPopup(true)}>
              <ListSVG />
            </ListButton>
          </div>
        </Tooltip>
      </HStack>

      {showAllBeenDelegatedPopup && (
        <AllBeenDelegatedListPopup
          beenDelegatedList={beenDelegatedList}
          setShow={setShowAllBeenDelegatedPopup}
        />
      )}
    </>
  );
}
