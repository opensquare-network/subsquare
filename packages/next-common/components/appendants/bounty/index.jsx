import { useBountyAppendantsContext } from "next-common/context/bountyAppendants";
import AppendantItem from "next-common/components/appendants/common/appendantItem";
import MoreActions from "next-common/components/appendants/common/moreActions";
import { memo } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";

const BountyEditorAppendantPopup = dynamicPopup(() =>
  import("next-common/components/appendants/bounty/appendantEditorPopup"),
);

const BountyMoreActions = ({ data }) => {
  const { update } = useBountyAppendantsContext();

  return (
    <MoreActions data={data} EditPopup={BountyEditorAppendantPopup} update={update} />
  );
};

function BountyAppendants() {
  const { appendants } = useBountyAppendantsContext();
  if (!appendants || appendants?.length === 0) {
    return null;
  }

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
