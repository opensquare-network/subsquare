import React, { useCallback, useState } from "react";
import Popup from "../popup/wrapper/Popup";
import noop from "lodash.noop";
import PrimaryButton from "../buttons/primaryButton";
import { PopupButtonWrapper } from "../popup/wrapper";
import { useDispatch } from "react-redux";
import GhostButton from "../buttons/ghostButton";

export default function DeletePopup({
  itemName = "item",
  setShow = noop,
  deletePost = noop,
}) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const doDelete = useCallback(async () => {
    setIsLoading(true);
    try {
      await deletePost();
      setShow(false);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  return (
    <Popup title="Report" onClose={() => setShow(false)}>
      <div className="text-[14px]">
        This will delete this {itemName} permanently. You will not be able to
        recover it.
      </div>
      <PopupButtonWrapper className="gap-[8px]">
        <GhostButton onClick={() => setShow(false)}>Cancel</GhostButton>
        <PrimaryButton
          className="!bg-red-500"
          isLoading={isLoading}
          onClick={doDelete}
        >
          Delete
        </PrimaryButton>
      </PopupButtonWrapper>
    </Popup>
  );
}
