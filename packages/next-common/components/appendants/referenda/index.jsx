import { useReferendaAppendantsContext } from "next-common/context/referendaAppendants";
import AppendantItem from "next-common/components/appendants/common/item";
import MoreActions from "next-common/components/appendants/common/moreActions";
import { memo } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";

const ReferendaEditAppendantPopup = dynamicPopup(() => import("./editPopup"));

const ReferendaMoreActions = ({ data }) => {
  const { update } = useReferendaAppendantsContext();

  return (
    <MoreActions
      data={data}
      EditPopup={ReferendaEditAppendantPopup}
      update={update}
    />
  );
};

function ReferendaAppendants() {
  const { appendants } = useReferendaAppendantsContext();
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
          MoreActions={ReferendaMoreActions}
        />
      ))}
    </div>
  );
}

export default memo(ReferendaAppendants);
