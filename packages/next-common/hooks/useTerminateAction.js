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
import TerminateApplicationPopup from "next-common/components/terminateApplicationPopup";
import {
  finalStateActionTextMap,
  finalStateMap,
} from "next-common/utils/consts/fellowship/application";

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

  const showTerminateAction =
    isFellowshipApplicationPost && [finalStateMap.New].includes(post?.status);
  const canTerminate = isAdmin;

  let actionsComponent = null;
  let popupComponent = null;

  if (!post || !showTerminateAction) {
    return null;
  }

  const supportedActions = [
    finalStateMap.Rejected,
    finalStateMap.Invalid,
    finalStateMap.Timeout,
  ];

  actionsComponent = (
    <>
      {supportedActions.map((type) => (
        <TerminateMenuItem
          key={type}
          onClick={() => {
            setShow(false);
            setShowPopup(true);
            setActionType(finalStateMap[type]);
          }}
          disabled={!canTerminate}
          type={type}
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

  return {
    actionsComponent,
    popupComponent,
  };
}

function TerminateMenuItem({ onClick, disabled, type }) {
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
        {type === finalStateMap.Rejected && <SystemCancel />}
        {type === finalStateMap.Invalid && <SystemInvalid />}
        {type === finalStateMap.Timeout && <SystemTimeout />}
      </div>
      <span>{finalStateActionTextMap[type]}</span>
    </OptionItem>
  );
}
