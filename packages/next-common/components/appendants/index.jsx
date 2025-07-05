import AppendItem from "./item";
import { memo } from "react";
import { useBountyAppendantsContext } from "next-common/context/bountyAppendants";

function Appendants() {
  const { appendants } = useBountyAppendantsContext();

  if (!appendants || appendants?.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <span className="text14Bold text-textPrimary">Appendants</span>
      {appendants?.map((item, index) => (
        <AppendItem key={item?._id} index={index} data={item} />
      ))}
    </div>
  );
}

export default memo(Appendants);
