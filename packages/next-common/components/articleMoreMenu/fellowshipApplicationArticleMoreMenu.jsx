import React, { useRef, useState } from "react";
import { OptionWrapper } from "next-common/components/internalDropdown/styled";
import { SystemMore } from "@osn/icons/subsquare";
import { useClickAway } from "react-use";
import { EditMenuItem, ReportMenu } from "./common";
import useTerminateAction from "next-common/hooks/useTerminateAction";

export default function FellowshipApplicationArticleMoreMenu({
  editable,
  setIsEdit,
}) {
  const ref = useRef();
  const [show, setShow] = useState(false);
  const { actionsComponent, popupComponent } =
    useTerminateAction({
      onShowPopup: () => setShow(false),
    }) || {};

  useClickAway(ref, () => setShow(false));

  return (
    <div ref={ref} className="relative">
      <SystemMore
        className="w-5 h-5 [&_path]:fill-textTertiary cursor-pointer"
        onClick={() => setShow(!show)}
      />
      <OptionWrapper className={!show && "hidden"}>
        {editable && (
          <EditMenuItem
            onClick={() => {
              setIsEdit(true);
              setShow(false);
            }}
          />
        )}
        {actionsComponent}
        <ReportMenu setShow={setShow} />
      </OptionWrapper>
      {popupComponent}
    </div>
  );
}
