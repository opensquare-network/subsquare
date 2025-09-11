import HStack from "next-common/components/styled/hStack";
import ListSVG from "next-common/assets/imgs/icons/list.svg";
import Tooltip from "next-common/components/tooltip";
import { useState } from "react";
import { ListButton } from "./styled";
import AllBeenDelegatedInfo from "./allBeenDelegatedInfo";
import dynamicPopup from "next-common/lib/dynamic/popup";

const AllBeenDelegatedListPopup = dynamicPopup(() =>
  import("next-common/components/summary/democracyAllBeenDelegatedPopup"),
);

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
