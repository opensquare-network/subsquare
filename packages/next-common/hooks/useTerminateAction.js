import { detailPageCategory } from "next-common/utils/consts/business/category";
import { useDetailType } from "next-common/context/page";
import { OptionItem } from "next-common/components/internalDropdown/styled";
import {
  SystemCancel,
  SystemInvalid,
  SystemTimeout,
} from "@osn/icons/subsquare";
import { useState } from "react";
import { noop } from "lodash-es";
import TerminateApplicationPopup, {
  finalStateMap,
} from "next-common/components/terminateApplicationPopup";

export default function useTerminateAction({
  post = null,
  isAdmin = false,
  setShow = noop,
}) {
  const postType = useDetailType();
  const [showPopup, setShowPopup] = useState(false);
  const [actionType, setActionType] = useState(null);

  const isFellowshipApplicationPost =
    postType === detailPageCategory.FELLOWSHIP_APPLICATION;

  const showTerminateAction = ["new"].includes(post?.status);
  const canTerminate = isFellowshipApplicationPost && isAdmin;

  let actionsComponent = null;
  let popupComponent = null;

  if (!post) {
    return null;
  }

  if (showTerminateAction) {
    actionsComponent = (
      <>
        {Object.entries(finalStateMap).map(([key, value]) => (
          <TerminateMenuItem
            key={key}
            onClick={() => {
              setShow(false);
              setShowPopup(true);
              setActionType(value);
            }}
            disabled={!canTerminate}
            text={key}
          />
        ))}
      </>
    );

    popupComponent = showPopup && (
      <TerminateApplicationPopup
        finalState={actionType}
        onClose={() => setShowPopup(false)}
      />
    );
  }

  return {
    actionsComponent,
    popupComponent,
  };
}

function TerminateMenuItem({ onClick, disabled, text }) {
  return (
    <OptionItem
      className={
        disabled
          ? "text-textDisabled [&_path]:fill-textDisabled cursor-not-allowed"
          : ""
      }
      onClick={!disabled ? onClick : noop}
    >
      <div className="mr-2">
        {text === "Rejected" && <SystemCancel />}
        {text === "Invalid" && <SystemInvalid />}
        {text === "Timeout" && <SystemTimeout />}
      </div>
      <span>{text}</span>
    </OptionItem>
  );
}
