import { useBountyAppendantsContext } from "next-common/context/bountyAppendants";
import AppendantItem from "next-common/components/appendants/common/appendantItem";
import MoreActions from "next-common/components/appendants/common/moreActions";
import { memo } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";

const BountyAppendantPopup = dynamicPopup(() =>
  import("next-common/components/appendants/bounty/appendantPopup"),
);

function BountyAppendants() {
  const { appendants, update } = useBountyAppendantsContext();
  if (!appendants || appendants?.length === 0) {
    return null;
  }

  const BountyMoreActions = ({ data }) => (
    <MoreActions data={data} EditPopup={BountyAppendantPopup} update={update} />
  );

  return (
    <div className="flex flex-col">
      <span className="text14Bold text-textPrimary">Appendants</span>
      {appendants?.map((item, index) => (
        <AppendantItem
          key={item?._id}
          index={index}
          data={item}
          MoreActions={BountyMoreActions}
        />
      ))}
    </div>
  );
}

export default memo(BountyAppendants);
