import { useState, useRef } from "react";
import { SystemMore } from "@osn/icons/subsquare";
import { OptionWrapper } from "next-common/components/internalDropdown/styled";
import {
  EditMenuItem,
  DeleteMenuItem,
} from "next-common/components/contentMenu";
import { useClickAway } from "react-use";
import dynamicPopup from "next-common/lib/dynamic/popup";

const DeletePopup = dynamicPopup(() =>
  import("next-common/components/appendants/common/deleteAppendantPopup"),
);

export default function MoreActions({ data, EditPopup, update }) {
  const [show, setShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const ref = useRef();

  useClickAway(ref, () => setShow(false));

  return (
    <>
      <div ref={ref} className="relative">
        <SystemMore
          className="w-5 h-5 [&_path]:fill-textTertiary cursor-pointer"
          onClick={() => {
            setShow(!show);
          }}
        />
        {show && (
          <OptionWrapper>
            <EditMenuItem setIsEdit={setIsEdit} setShow={setShow} />
            <DeleteMenuItem
              setShowDeletePopup={setShowDeletePopup}
              setShow={setShow}
            />
          </OptionWrapper>
        )}
      </div>

      {isEdit && (
        <EditPopup setIsAppend={setIsEdit} editData={data} isEditMode={true} />
      )}

      {showDeletePopup && (
        <DeletePopup
          appendantData={data}
          setShow={setShowDeletePopup}
          update={update}
        />
      )}
    </>
  );
}
