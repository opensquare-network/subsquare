import Popup, { PopupSize } from "next-common/components/popup/wrapper/Popup";
import React from "react";
import BountyDetailPopupSummary from "./bountyDetailPopupSummary";
import BountyDetailPopupTabs from "./tabsContent/index";
import { isNil } from "lodash-es";

function BountyDetailPopup({ onClose, childBounties, bountyIndex, item }) {
  if (isNil(childBounties) || isNil(bountyIndex) || isNil(item)) return null;

  return (
    <Popup
      title="Bounty Detail"
      className="p-6"
      size={PopupSize.MEDIUM}
      onClose={onClose}
    >
      <BountyDetailPopupSummary item={item} />
      <BountyDetailPopupTabs
        childBounties={childBounties}
        bountyIndex={bountyIndex}
      />
    </Popup>
  );
}

export default React.memo(BountyDetailPopup);
